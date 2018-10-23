number=$1
if [ !-n $number ]; then
    echo "VERSION IS NULL";
else
    sed -i "3s/^.*$/\"version\": \"${number}\"/" version.json
fi

cd src/
sed -i "s/isBrowser: false/isBrowser: true/g" config.js

npm run build

sed -i "s/isBrowser: true/isBrowser: false/g" config.js

