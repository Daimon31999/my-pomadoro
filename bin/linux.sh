cd ../.
MYPATH="$(pwd)"
LINK="/usr/local/sbin/pomadoro-console"

# create symbol link if not exitst
if [ ! -L "$LINK" ]; then
    echo "Create link..."
    sudo rm /usr/local/sbin/pomadoro-console
    sudo ln -s $MYPATH /usr/local/sbin/pomadoro-console
    echo "Link created!"
fi
cd $LINK
if [ "$(grep '^alias pomadoro=' ~/.bashrc)" ]
then
    node ./src/bin.js
else
    echo 'Create ALIAS pomadoro...'
    MYALIAS="alias pomadoro=\"test=\$(pwd) && cd /usr/local/sbin/pomadoro-console/bin && sh linux.sh && cd \$test\""
    # Write to .bashrc
    echo $MYALIAS >> ~/.bashrc
    echo 'ALIAS created!'
    echo 'Pomadoro installed!'
    echo 'Just type pomadoro to use it!'
fi
