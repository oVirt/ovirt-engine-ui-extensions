#!/bin/bash -ex

# Clean the artifacts directory:
test -d exported-artifacts && rm -rf exported-artifacts || :

# Resolve the version used for RPM build from package.json:
version="$(jq -r '.version' package.json)"

# The release is passed via environment variable set by the CI (default: 0.master):
rpm_release="${PACKAGE_RPM_RELEASE:-0.master}"

# Build the source tar file from git known files:
tar_name="ovirt-engine-ui-extensions"
tar_prefix="${tar_name}-${version}/"
tar_file="${tar_name}-${version}.tar.gz"
git archive --prefix="${tar_prefix}" --output="${tar_file}" HEAD

# Create rpm build directories and place the src tar in the right place
export top_dir="${PWD}/tmp.repos"
test -d "${top_dir}" && rm -rf "${top_dir}" || :
mkdir -p "${top_dir}"/{SPECS,RPMS,SRPMS,SOURCES}
mv "${tar_file}" "${top_dir}/SOURCES"

# Generate the .spec file from the template for the distribution where
# the build process is running:
rpm_dist="${rpm_dist:=$(rpm --eval '%dist')}"
spec_src="${PWD}$(test -e "spec.in" && echo "" || echo "/packaging")"
spec_template=${spec_src}/$(test -e "spec${rpm_dist}.in" && echo "spec${rpm_dist}.in" || echo "spec.in")
spec_file="${top_dir}/SPECS/ovirt-engine-ui-extensions.spec"
sed \
  -e "s|@RPM_VERSION@|${version}|g" \
  -e "s|@RPM_RELEASE@|${rpm_release}|g" \
  -e "s|@TAR_FILE@|${tar_file}|g" \
  < "${spec_template}" \
  > "${spec_file}"

# Make sure the rpmspec file is valid (specifically that the changelog dates won't kill the build)
SPECLINT=$(rpmlint ${spec_file} 2>&1) || linterror=$?
if [[ $linterror -ne 0 ]]; then
    echo "Error or warning in '${spec_file}':"
    echo "$SPECLINT"
    exit 6
fi

# Build the source and binary .rpm files:
rpmbuild \
  -ba \
  --define="_topdir ${top_dir}" \
  --define="release_suffix ${RELEASE_SUFFIX:-}" \
  $([[ ${OFFLINE_BUILD:-1} -eq 0 ]] && echo "--without ovirt_use_nodejs_modules" || :) \
  "${spec_file}"

# Copy the .tar.gz and .rpm files to the artifacts directory:
[[ -d exported-artifacts ]] || mkdir -p exported-artifacts

for file in $(find $top_dir -type f -regex '.*\.\(tar.gz\|rpm\)'); do
  echo "Archiving file \"$file\"."
  mv "$file" exported-artifacts/
done
