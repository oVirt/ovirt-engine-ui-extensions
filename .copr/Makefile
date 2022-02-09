.PHONY: installdeps srpm

# requirements for packaging/build.sh (see also ../packaging/spec.in)
installdeps:
	dnf -y install git jq rpmlint rpm-build

srpm: installdeps
	./packaging/build.sh copr
	cp exported-artifacts/*.src.rpm $(outdir)
