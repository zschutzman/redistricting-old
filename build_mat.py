# -*- coding: utf-8 -*-
"""
Created on Mon Jun 11 11:16:29 2018

@author: zschutzman

based on spatial_weights_pa.py by tug30201
"""

import os



# geospatial
import geopandas as gpd
import pysal as ps
import numpy as np
import sys
import math
import scipy.linalg
import networkx as nx
import random



# visualization
import matplotlib.pyplot as plt

print("starting")
filepath = sys.argv[1]
print(file1)

file2 = sys.argv[2]

'''data_folder = '2011 Voting District Boundary Shapefiles'
url = "http://aws.redistricting.state.pa.us/Redistricting/Resources/GISData/2011-Voting-District-Boundary-Shapefiles.zip"
from get_geodata_pa import get_and_unzip
get_and_unzip(url, ".")
'''

gu_shp = filepath + '.shp'
df_gu = gpd.read_file(gu_shp)

dist_shp = file2
df_dist = gpd.read_file(dist_shp)

print(df_dist.crs)
print(df_gu.crs)





print(len(set(df_gu.centroid.x)))

df_gu.sort_values('CD115FP')
gu_cent = df_gu.centroid

#print(df_gu)
#print(df_gu.loc[:,'CD115FP']=='01')
seg = df_gu.centroid
c_x=seg.x
c_y = seg.y
basemap  =df_gu.plot(color="white",edgecolor="lightgray")

#print(df_gu.loc[df_gu.loc[:,'CD115FP']=='02'])
mat = np.empty([0,0])
print(mat.shape)
districtlist = list(set(df_gu.loc[:,'CD115FP']))
districtlist.sort()
rWlist = []
cols=['red','black']
for d in districtlist:
    m=df_gu.loc[df_gu.loc[:,'CD115FP']==d]
    print(len(m))
    #print(m)
    rW=ps.weights.Rook.from_dataframe(m)
    rWlist.append(rW)
    #print(rW.neighbors)
    w = rW
    c=cols.pop()
    mat = scipy.linalg.block_diag(mat,rW.full()[0])
    c_x=m.centroid.x
    c_y = m.centroid.y
    print(len(m.centroid))
    for i,jj in w.neighbors.items(): 
        
        for j in jj:
            if not df_gu.loc[i,'CD115FP'] == df_gu.loc[j,'CD115FP']: print('sep!')
            basemap.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
            continue

print(mat.shape)
print(sum(mat.diagonal()))

plt.title("maybe?")
plt.show()
'''
'''
G= nx.from_numpy_matrix(mat)

nx.draw(g,node_shape='.',node_color='b')
plt.show()
