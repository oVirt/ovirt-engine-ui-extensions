.PHONY: installdeps srpm

# requirements for packaging/build.sh (see also ../packaging/spec.in)
installdeps:
	dnf -y install git jq rpmlint rpm-build

# explicity mark the copr generated git repo directory (which is done prior to the mock
# call to the make_srpm and will be the current pwd) as safe for git commands
git-safe:
	git config --global --add safe.directory "$(shell pwd)"

srpm: installdeps git-safe
	./packaging/build.sh copr
	cp exported-artifacts/*.src.rpm $(outdir)
