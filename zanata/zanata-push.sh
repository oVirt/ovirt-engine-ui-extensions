#! /usr/bin/env bash
[[ -e zanata.xml ]] || cd zanata

JAVA_HOME=$(alternatives --list | grep 'jre_1.8.0' | head -1 | cut -f 3)
ZANATA_LOCALES=de,es,fr,it,ja,ko,pt-BR,zh-CN,cs

mvn \
    org.zanata:zanata-maven-plugin:4.6.2:push \
    -Dzanata.pushType="source" \
    -Dzanata.locales="$ZANATA_LOCALES"
