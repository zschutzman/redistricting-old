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

cols=['tab:blue', 'tab:orange', 'tab:green', 'tab:red', 'tab:purple', 'tab:brown', 'tab:pink', 'tab:gray', 'tab:olive', 'tab:cyan']


df_vtd = gpd.read_file(os.path.join('us_vtd.shp'))
df_cd =  gpd.read_file('cd_us.shp')

df_vtd['dummy']=1

print("aggregating")
(df_vtd,new_tar) = areal.aggregate(df_vtd,df_cd,['dummy'],['STATECD'])
df_vtd.to_file('us_annotated.shp',driver='ESRI Shapefile')

'''
print("sorting")
df_vtd.sort_values('STATECD')

vtd_cent = df_vtd.centroid
cx = vtd_cent.x
cy = vtd_cent.y

basemap_s  =df_vtd.plot(color="white",edgecolor="lightgray")

basemap_m  =df_vtd.plot(color="white",edgecolor="lightgray",figsize=(12,12))

basemap_l  =df_vtd.plot(color="white",edgecolor="lightgray",figsize=(30,30))
mat = np.empty([0,0])


dists = list(set(df_vtd.loc[:,'STATECD']))
dists.sort()

rWlist = []


print("doing CD dual graphs")
for d in dists:
    m=df_vtd.loc[df_vtd.loc[:,'STATECD']==d]
    rW = ps.weights.Rook.from_dataframe(m)

    rWlist.append(rW)
    w=rW

    mat = scipy.linalg.block_diag(mat,rW.full()[0])
    
    c_x=m.centroid.x
    c_y = m.centroid.y

    c = random.choose(cols)

    for i,jj in w.neighbors.items(): 
        
        for j in jj:
            basemap_s.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
            basemap_m.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
            basemap_l.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
    
  
    plt.figure(1)
    plt.savefig(code+'_graph_s.png', bbox_inches='tight', pad_inches=0)
    plt.figure(2)
    plt.savefig(code+'_graph_m.png', bbox_inches='tight', pad_inches=0)
    plt.figure(3)
    plt.savefig(code+'_graph_l.png', bbox_inches='tight', pad_inches=0)



plt.show()
'''
#print("doing whole state dual graph")
#plt.clf()

#aW = ps.weights.Rook.from_dataframe(df_vtd)
#fullmat = aW.full()[0]
#basemap  =df_vtd.plot(color="white",edgecolor="lightgray")
'''
for i, jj in aW.neighbors.items():
    # origin = centroids[k]
    for j in jj:
        
        basemap.plot([cx[i], cx[j]], [cy[i], cy[j]], linestyle = '-', linewidth = 1,color='r')
'''
#plt.show()
#print("saving")
#np.savetxt(code+'_dists.txt', mat, delimiter=',', newline=';', fmt='%d')
#np.savetxt(code+'_full.txt', fullmat, delimiter=',', newline=';', fmt='%d')



        
