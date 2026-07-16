import json

# 지오 데이터를 canvas에서 쓸 지구본 데이터로 변환
INPUT_FILE = "ne_110m_land.json"
OUTPUT_FILE = "landData.js"


# 점 간격 단순화
# 숫자가 클수록 데이터 감소
STEP = 5



def simplify_polygon(points, step=STEP):

    result = points[::step]


    if result[0] != result[-1]:
        result.append(result[0])


    return [
        [
            round(p[0], 4),
            round(p[1], 4)
        ]
        for p in result
    ]

def extract_polygons(geometry):

    geo_type = geometry["type"]

    coords = geometry["coordinates"]


    result = []


    if geo_type == "Polygon":

        # 첫 번째 ring = 외곽선
        outer = coords[0]

        result.append(
            simplify_polygon(
                outer
            )
        )


    elif geo_type == "MultiPolygon":

        for polygon in coords:

            outer = polygon[0]

            result.append(
                simplify_polygon(
                    outer
                )
            )


    return result



with open(
    INPUT_FILE,
    "r",
    encoding="utf-8"
) as f:

    geojson = json.load(f)



land_polygons = []



for feature in geojson["features"]:


    geometry = feature.get("geometry")


    if not geometry:
        continue


    land_polygons.extend(
        extract_polygons(
            geometry
        )
    )



print(
    "polygon count:",
    len(land_polygons)
)


point_count = sum(
    len(p)
    for p in land_polygons
)


print(
    "point count:",
    point_count
)



js = (
    "const landPolygons = "
    +
    json.dumps(
        land_polygons,
        ensure_ascii=False
    )
    +
    ";"
)



with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:

    f.write(js)



print(
    "saved:",
    OUTPUT_FILE
)