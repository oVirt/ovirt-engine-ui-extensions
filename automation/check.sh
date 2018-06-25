#!/bin/sh -ex

DISTVER="$(rpm --eval "%dist"|cut -c2-3)"
PACKAGER=""
if [[ "${DISTVER}" == "el" ]]; then
    PACKAGER=yum
else
    PACKAGER=dnf
fi


# Force CI to get the latest version of these packages:
dependencies="$(sed -e '/^[ \t]*$/d' -e '/^#/d' automation/build.packages.force)"
${PACKAGER} clean metadata
${PACKAGER} -y install ${dependencies}

# Set up Node.js environment with dependencies linked to ./node_modules:
source /usr/share/ovirt-engine-nodejs-modules/setup-env.sh

# Verify that dependency versions (semver ranges) in package.json have
# matching resolutions in the yarn.lock file:
yarn check

# Lint code and run tests:
yarn test
