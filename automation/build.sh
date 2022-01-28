#!/bin/bash -ex

[[ "${1:-foo}" == "copr" ]] && source_build=1 || source_build=0
[[ ${MOVE_ARTIFACTS:-1} -eq 1 ]] && use_exported_artifacts=1 || use_exported_artifacts=0

# Clean the artifacts directory:
test -d exported-artifacts && rm -rf exported-artifacts || :

# Create the artifacts directory:
mkdir -p exported-artifacts

# Resolve the version and snapshot used for RPM build:
version="$(jq -r '.version' package.json)"
date="$(date --utc +%Y%m%d)"
commit="$(git log -1 --pretty=format:%h)"
snapshot=".${date}git${commit}"

# Check if the commit is tagged (indicates a release build):
tag="$(git tag --points-at ${commit} | grep -v jenkins || true)"
if [ ! -z ${tag} ]; then
  snapshot=""
fi

# Build the source tar file from git known files:
tar_name="ovirt-engine-ui-extensions"
tar_prefix="${tar_name}-${version}/"
tar_file="${tar_name}-${version}${snapshot}.tar.gz"
git archive --prefix="${tar_prefix}" --output="${tar_file}" HEAD

# Create rpm build directories and place the src tar in the right place
export top_dir="${PWD}/tmp.repos"
test -d "${top_dir}" && rm -rf "${top_dir}" || :
mkdir -p "${top_dir}"/{SPECS,RPMS,SRPMS,SOURCES}
mv "${tar_file}" "${top_dir}/SOURCES"

# Build the RPM:
pushd packaging
    export source_build
    export tar_version="${version}"
    export tar_file
    export rpm_snapshot="${snapshot}"
    ./build.sh
popd

# Copy the .tar.gz and .rpm files to the artifacts directory:
if [[ $use_exported_artifacts -eq 1 ]] ; then
  [[ -d exported-artifacts ]] || mkdir -p exported-artifacts

  for file in $(find $top_dir -type f -regex '.*\.\(tar.gz\|rpm\)'); do
    echo "Archiving file \"$file\"."
    mv "$file" exported-artifacts/
  done
fi
