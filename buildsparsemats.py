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

cols=['tab:blue', 'tab:orange', 'tab:green', 'tab:red', 'tab:purple', 'tab:brown', 'tab:pink', 'tab:gray', 'tab:olive', 'tab:cyan']

#codelist=['01', '02', '04', '05', '06',  '08', '09', '10', '11', '12', '13',  '15', '16', '17', '18', '19', '20', '22', '23', '24', '25', '26', '27', '28', '29',  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '42', '45', '46', '47', '48', '49', '50', '51', '53', '54', '55', '56']
print("opening")
#codelist=['30','41','44','21']
codelist=['37']

df_cd =  gpd.read_file('nc12.shp')

for code in codelist:
    df_vtd = gpd.read_file(os.path.join('/home/zachary/Downloads/zips/tl_2012_'+code+'_vtd10.shp'))

    df_vtd['dummy']=1

    print("aggregating")
    (df_vtd,new_tar) = areal.aggregate(df_vtd,df_cd,['dummy'],['STATECD'])
    print("sorting")
    df_vtd.sort_values('STATECD')

    vtd_cent = df_vtd.centroid
    cx = vtd_cent.x
    cy = vtd_cent.y
    basemap_s  =df_vtd.plot(color="white",edgecolor="lightgray")

    basemap_m  =df_vtd.plot(color="white",edgecolor="lightgray",figsize=(12,12))

    basemap_l  =df_vtd.plot(color="white",edgecolor="lightgray",figsize=(30,30))
    #mat = np.empty([0,0])

    dists = list(set(df_vtd.loc[:,'STATECD']))
    dists.sort()
    mat=np.zeros([0,0])
    rWlist = []
    print("doing CD dual graphs")
    for d in dists:
        m=df_vtd.loc[df_vtd.loc[:,'STATECD']==d]
        rW = ps.weights.Rook.from_dataframe(m)
        rWlist.append(rW.full()[0].astype(int))
    
    mat = scipy.sparse.block_diag(rWlist)
    scipy.sparse.save_npz('adj_mats/'+code+'_blocksjudge', mat)
    fullwts = ps.weights.Rook.from_dataframe(df_vtd).full()[0]
    print(type(fullwts))
    fullwts = fullwts.astype(int)
    fullwts = scipy.sparse.coo_matrix(fullwts)
    scipy.sparse.save_npz('adj_mats/'+code+'_fulljudge',fullwts)
    
                       
        



    
        



        
