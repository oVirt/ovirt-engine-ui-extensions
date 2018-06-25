#!/bin/sh -ex

DISTVER="$(rpm --eval "%dist"|cut -c2-3)"
PACKAGER=""
if [[ "${DISTVER}" == "el" ]]; then
    PACKAGER=yum
else
    PACKAGER=dnf
fi


# Clean and then create the artifacts directory:
rm -rf exported-artifacts
mkdir -p exported-artifacts

# Resolve the version and snapshot used for RPM build:
version="$(jq -r '.version' package.json)"
date="$(date --utc +%Y%m%d)"
commit="$(git log -1 --pretty=format:%h)"
snapshot=".${date}git${commit}"

# Check if the commit is tagged (indicates a release build):
tag="$(git describe --exact-match ${commit} 2>/dev/null || true)"
if [ ! -z ${tag} ]; then
  snapshot=""
fi

# Build the tar file:
tar_name="ovirt-engine-dashboard"
tar_prefix="${tar_name}-${version}/"
tar_file="${tar_name}-${version}${snapshot}.tar.gz"
git archive --prefix="${tar_prefix}" --output="${tar_file}" HEAD

# The "build.packages.force" file contains BuildRequires packages
# to be installed using their latest version.
# When reading the file, make sure to remove blank lines as well
# as lines starting with the "#" character:
build_requires="$(sed -e '/^[ \t]*$/d' -e '/^#/d' -e 's/^/BuildRequires: /' < \
    automation/build.packages.force | \
    sed ':a;N;$!ba;s/\n/\\n/g')"

# Force CI to get the latest version of these packages:
dependencies="$(sed -e '/^[ \t]*$/d' -e '/^#/d' automation/build.packages.force)"
${PACKAGER} clean metadata
${PACKAGER} -y install ${dependencies}

# Build the RPM:
mv "${tar_file}" packaging/
pushd packaging
    export tar_version="${version}"
    export tar_file
    export rpm_snapshot="${snapshot}"
    export build_requires
    ./build.sh
popd

# Copy the .tar.gz and .rpm files to the artifacts directory:
for file in $(find . -type f -regex '.*\.\(tar.gz\|rpm\)'); do
  echo "Archiving file \"$file\"."
  mv "$file" exported-artifacts/
done
