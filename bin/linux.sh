cd ../.
MYPATH="$(pwd)"
LINK="/usr/local/sbin/my-pomadoro"

# create symbol link if not exitst
if [ ! -L "$LINK" ]; then
    echo "Create link..."
    echo "Type your password:"
    sudo ln -s $MYPATH /usr/local/sbin/my-pomadoro
    echo "Link created!"
fi
cd $LINK
if [ "$(grep '^alias pomadoro=' ~/.bashrc)" ]
then
    node ./src/bin.js
else
    echo 'Create ALIAS pomadoro...'
    MYALIAS="alias pomadoro=\"test=\$(pwd) && cd /usr/local/sbin/my-pomadoro/bin && sh linux.sh && cd \$test\""
    # Write to .bashrc
    echo $MYALIAS >> ~/.bashrc
    echo 'ALIAS created!'
    echo 'Pomadoro installed!'
    echo 'Just type pomadoro to use it!'
fi
