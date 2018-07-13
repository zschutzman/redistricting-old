import os

import areal_interpolation as areal

# geospatial
import geopandas as gpd
import pysal as ps
import numpy as np
import sys
import math
import scipy.linalg
import networkx as nx
import random


import matplotlib.pyplot as plt


print("opening")


df_cd =  gpd.read_file('cd_us.shp')


df_vtd = gpd.read_file('./maine/gis_data/election_shapes/clean_town_house_elecs.shp')
print(df_vtd)

df_vtd['dummy']=1

print("aggregating")
(df_vtd,new_tar) = areal.aggregate(df_vtd,df_cd,['dummy'],['STATECD'])
df_vtd.to_file("./maine/election_shapes/clean_town_house_elecs_with_CD.shp")
