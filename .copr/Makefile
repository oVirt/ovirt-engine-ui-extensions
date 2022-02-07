.PHONY: installdeps srpm

# requirements for automation/build.sh (see also ../packaging/spec.in)
installdeps:
	dnf -y install git jq rpmlint rpm-build

srpm: installdeps
	./automation/build.sh copr
	cp exported-artifacts/*.src.rpm $(outdir)
