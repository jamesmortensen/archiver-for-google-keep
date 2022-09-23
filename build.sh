mkdir -p build/src
cp -np package.json README.md build/
for file in {*.js,src/*.js}; do
    npx uglifyjs "$file" -c -m  -o "./build/$file" 
    echo minified: "$file" 
done 
