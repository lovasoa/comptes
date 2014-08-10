base="`dirname $0`/../"
coffeepath="$base/_vendor/coffee"
couldwatch=0

while [ $couldwatch = 0 ]
do
  inotifywait "$coffeepath"
  couldwatch=$?
  coffee --compile \
    --join "$base/_attachments/js/app.js" \
    "$coffeepath" \
    2>/tmp/coffee-error

  if [ $? = 0 ]
  then
    echo "Compilation successfull. Pushing..."
    couchapp push
    echo "Pushed!"
  else
    cat /tmp/coffee-error
    notify-send -t 2500 "Compilation error!$(head -n 1 /tmp/coffee-error)"
  fi
  rm /tmp/coffee-error
done
