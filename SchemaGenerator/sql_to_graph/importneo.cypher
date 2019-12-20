USING PERIODIC COMMIT 10000
LOAD CSV FROM "file:///projects.csv" as row
CREATE (:Project {projectid:row[0], name:row[1], file_name:row[2]})

USING PERIODIC COMMIT 10000
LOAD CSV FROM "file:///sites.csv" as row
CREATE (:Site {siteid:row[0], name:row[1], geometry:row[2]})

USING PERIODIC COMMIT 10000
LOAD CSV FROM "file:///buildings.csv" as row
CREATE (:Building {buildingid:row[0], name:row[1], num_floors:row[2]})

USING PERIODIC COMMIT 10000
LOAD CSV FROM "file:///floors.csv" as row
CREATE (:Floor {floorid:row[0], name:row[1], floor_num:row[2]})

USING PERIODIC COMMIT 10000
LOAD CSV FROM "file:///items.csv" as row
CREATE (:Item {itemid:row[0], name:row[1], type:row[2], geometry:row[3]})

USING PERIODIC COMMIT 10000
LOAD CSV FROM "file:///properties.csv" as row
CREATE (:Property {propid:row[0], is_desk:row[1], is_hot:row[2], is_occupied:row[3], price:row[4], cost:row[5], area:row[6],material:row[7]})

CREATE INDEX ON :Building(buildingid);
CREATE INDEX ON :Floor(floorid);
CREATE INDEX ON :Item(itemid);
CREATE INDEX ON :Project(projectid);
CREATE INDEX ON :Property(propid);
CREATE INDEX ON :Site(siteid);

Load CSV from "file:///ProjectsToSitesMapping.csv" as row 
match (n:Project {projectid: row[0]})
match (m:Site {siteid: row[1]})
create (n) -[:CONTAINS]-> (m)
create (m) -[:BELONGS_TO]-> (n)

Load CSV from "file:///SitesToBuildingsMapping.csv" as row 
match (n:Site {siteid: row[0]})
match (m:Building {buildingid: row[1]})
create (n) -[:CONTAINS]-> (m)
create (m) -[:INSIDE]-> (n)

Load CSV from "file:///BuildingsToFloorsMapping.csv" as row 
match (n:Building {buildingid: row[0]})
match (m:Floor {floorid: row[1]})
create (n) -[:CONTAINS]-> (m)
create (m) -[:INSIDE]-> (n)

Load CSV from "file:///FloorToStructureMapping.csv" as row 
match (n:Floor {floorid: row[0]})
match (m:Item {itemid: row[1]})
create (n) -[:CONTAINS]-> (m)
create (m) -[:INSIDE]-> (n)

Load CSV from "file:///SpaceToItemMapping.csv" as row 
match (n:Item {itemid: row[0]})
match (m:Item {itemid: row[1]})
create (n) -[:CONTAINS]-> (m)
create (m) -[:INSIDE]-> (n)

Load CSV from "file:///ItemToPropertyMapping.csv" as row 
match (n:Item {itemid: row[0]})
match (m:Property {propid: row[1]})
create (n) -[:HAS_PROPERTY]-> (m)
create (m) -[:DEFINES]-> (n)

Load CSV from "file:///connections.csv" as row 
match (n:Item {itemid: row[0]})
match (m:Item {itemid: row[1]})
match (l:Item {itemid: row[2]})
create (n) -[:CONNECTS]-> (m)
create (n) -[:CONNECTS]-> (l)


