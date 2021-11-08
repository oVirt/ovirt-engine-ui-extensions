.PHONY: installdeps srpm

installdeps:
	dnf -y install git fontconfig jq rpm-build rpmdevtools dnf

srpm: installdeps
	./automation/build.sh copr
	cp exported-artifacts/*.src.rpm $(outdir)
