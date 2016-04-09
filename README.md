# Field Mapper
It's AngularJS's directive for field mapping. It can be used for any two list mapping or database table's column mapping.

## Requirements

- AngularJS 1.3.X  (https://angularjs.org/)
- D3 3.5.x (http://d3js.org/)

## How to Use

- `bower install fieldmapper`
- `<link rel="stylesheet" href="bower_components/fieldmapper/dist/styles.css">
   <script src="bower_components/fieldmapper/dist/index.js"></script>` - include these tags in your index.html file.
- `<div field-mapper source="sourceColumns" destination="destinationColumns" mapping="mappedColumns"></div>` - use this tag for fieldMapper component. For more info, refer demo/index.html

## Sample Screen-shots

#### Initial Screen
![Initial Screen](demo/fieldmapper-initial.png)

#### Fields Connected
![Fields Connected](demo/fieldmapper.png)

## Development

- `npm install`
- `npm run build` - to build the files to dist folder
- `npm run start` - to see the demo of the component.

MIT License
