dbname="comptes-backup-"$(date +%d%m%Y)
curl -X PUT "http://localhost:5984/$dbname"

curl -vX POST http://127.0.0.1:5984/_replicate \
  -d '{"source":"http://ophir.iriscouch.com/comptes","target":"'$dbname'"}' \
  -H "Content-Type:application/json"
