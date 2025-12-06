# 0 - droga (blank)
# 1 - miejsce parkingowe (normal)
# 2 - brama wjazdowa (gate)

layout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
]
y = len(layout)
x = len(layout[0])

binds = {0: "blank", 1: "normal", 2: "gate"}

normal_count = sum(1 for row in layout for cell in row if cell == 1)

normal_id = 1
non_normal_id = normal_count + 1
display_order = 0

result = []

for c in range(x):
    for r in range(y):
        cell = layout[r][c]
        role = binds[cell]

        if role == "normal":
            spot_id = normal_id
            normal_id += 1
        else:
            spot_id = non_normal_id
            non_normal_id += 1

        result.append(
            {
                "id": spot_id,
                "role": role,
                "displayOrder": display_order,
            }
        )
        display_order += 1

result.sort(key=lambda x: x["id"])

for item in result:
    print(
        f'{{ id: {item["id"]}, role: "{item["role"]}", displayOrder: {item["displayOrder"]}, occupied: false }},'
    )
