#! /usr/bin/env bash
[[ -e zanata.xml ]] || cd zanata

ZANATA_LOCALES=de,es,fr,it,ja,ko,pt-BR,zh-CN,cs,ka

mvn \
    at.porscheinformatik.zanata:zanata-maven-plugin:4.7.8:push \
    -Dzanata.pushType="source" \
    -Dzanata.locales="$ZANATA_LOCALES"
