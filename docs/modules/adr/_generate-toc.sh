#!/bin/bash
echo "= ADR Übersicht" > pages/toc.adoc
{
echo ""
echo '[cols="1,2,3,1"]'
echo '|==='
echo "|ID|Keywords|Summary|Status"
echo ""
for i in pages/0*-*.adoc ; do
    summary=$(head -1 "$i" | cut -d= -f2 | xargs)
    adr_nr=$(echo "$i" | cut -d- -f1 | sed -e 's,pages/,,g')
    status=$(grep ":status:" "$i" | cut -d":" -f3 | sed -e 's/^[[:space:]]*//g' -e 's/ *$//g')
    superseded_by=$(grep ":superseded-by:" "$i" | cut -d":" -f3 | sed -e 's/^[[:space:]]*//g' -e 's/ *$//g')
    keywords=$(awk '/keywords:/{print}' $i | cut -d: -f3 | sed -e 's/^[[:space:]]*//')
    xref=${i//pages\//}
    if [ -z "$superseded_by" ]; then
        echo "|xref:${xref}[ADR-$adr_nr]|$keywords|$summary|$status"
    fi
done
echo '|==='
} >> pages/toc.adoc
