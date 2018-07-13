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

specs = []

print("opening")

cols=['tab:blue', 'tab:orange', 'tab:green', 'tab:red', 'tab:purple', 'tab:brown', 'tab:pink', 'tab:gray', 'tab:olive', 'tab:cyan']


df_vtd = gpd.read_file('/home/zachary/Downloads/zips/tl_2012_37_vtd10.shp')
df_cd =  gpd.read_file('nc12.shp')

df_vtd['dummy']=1

print("aggregating")
(df_vtd,new_tar) = areal.aggregate(df_vtd,df_cd,['dummy'],['STATECD'])
print("sorting")
df_vtd.sort_values('STATECD')
df_cd.sort_values('STATECD')



print("test")
dists = list(set(df_vtd.loc[:,'STATECD']))
dists.sort()
rWlist = []
print("doing CD dual graphs")
for d in dists:

    m=df_vtd.loc[df_vtd.loc[:,'STATECD']==d]
    print(len(m))
    rW = ps.weights.Rook.from_dataframe(m)
    rWlist.append(rW)
    print(rW.full()[0],"ROOK")
    adj = rW.full()[0]
    deg = np.diag(adj.sum(axis=0)).astype(int)
    lap = deg-adj
    lap = lap.astype(int)
    lap
    print('Computed Laplacian... Now working on spectrum')
    spect = scipy.linalg.eig(lap)[0]
    gap = np.sort(spect)[1]
    print(gap)
    specs.append(gap)


specs = np.array(specs)
specs = np.real(specs)
df_cd['color'] = specs
print("GAPS: ",specs)
df_cd.plot(column = 'color', legend=True)
plt.show()
