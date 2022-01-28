#!/bin/bash -ex

# Name and version of the package:
tar_version="${tar_version:=0.0.0}"
tar_file="${tar_file:=ovirt-engine-ui-extensions-${tar_version}.tar.gz}"
rpm_version="${rpm_version:=${tar_version}}"
rpm_snapshot="${rpm_snapshot:=}"
rpm_dist="${rpm_dist:=$(rpm --eval '%dist')}"

# Generate the .spec file from the template for the distribution where
# the build process is running:
spec_template=$(test -e "spec${rpm_dist}.in" && echo "spec${rpm_dist}.in" || echo "spec.in")
spec_file="${top_dir}/SPECS/ovirt-engine-ui-extensions.spec"
sed \
  -e "s|@RPM_VERSION@|${rpm_version}|g" \
  -e "s|@RPM_SNAPSHOT@|${rpm_snapshot}|g" \
  -e "s|@TAR_FILE@|${tar_file}|g" \
  -e "s|@OFFLINE_BUILD@|${OFFLINE_BUILD:-1}|g" \
  < "${spec_template}" \
  > "${spec_file}"

# Make sure the rpmspec file is valid (specifically that the changelog dates won't kill the build)
SPECLINT=$(rpmlint ${spec_file} 2>&1) || linterror=$?
if [[ $linterror -ne 0 ]]; then
    echo "Error or warning in '${spec_file}':"
    echo "$SPECLINT"
    exit 6
fi

if [[ ${source_build:-0} -eq 1 ]] ; then
  # Build the source .rpm files:
  rpmbuild \
    -bs \
    --define="_topdir ${top_dir}" \
    "${spec_file}"
else
  # Build the source and binary .rpm files:
  rpmbuild \
    -ba \
    --define="_topdir ${top_dir}" \
    "${spec_file}"
fi
