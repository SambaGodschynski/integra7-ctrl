import config
import pandas as pd
from integra7.patch import Patch

def read_patches():
    data = pd.read_excel(config.data_file, engine='odf')
    nrows, _ = data.shape
    patches = []
    for row in range(0, nrows):
        patch = Patch()
        patch.id = row
        patch.name = data.iat[row, 0]
        patch.msb = int(data.iat[row, 1])
        patch.lsb = int(data.iat[row, 2])
        patch.pc = int(data.iat[row, 3])
        patch.category = data.iat[row, 4]
        patch.type = data.iat[row, 5]
        patches.append(patch)
    return patches