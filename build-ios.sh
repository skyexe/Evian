number=$1
if [ !-n $number ]; then   
    echo "VERSION IS NULL"; 
else  
    sed -i .orig "3s/^.*$/\"version\": \"${number}\"/" version.json
fi
rm ./ *.orig

cd src/
sed -i .orig "s/@headerTop: 0px/@headerTop: 20px/g" config.less

npm run build-ios

sed -i .orig "s/@headerTop: 20px/@headerTop: 0px/g" config.less

rm ./ *.orig
