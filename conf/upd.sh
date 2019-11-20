#!/bin/sh
echo "==================" | tee -a log/upd.out log/upd.err >/dev/null
echo "Restarting Updater" | tee -a log/upd.out log/upd.err >/dev/null
echo "==================" | tee -a log/upd.out log/upd.err >/dev/null
cd upd && npm install >>../log/upd.out 2>>../log/upd.err && exec npm start >>../log/upd.out 2>>../log/upd.err
