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


print("opening")
#codelist=['01', '02', '04', '05', '06',  '08', '09', '10', '11', '12', '13',  '15', '16', '17', '18', '19', '20', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', 
codelist = ['41']#, '42', '45', '46', '47', '48', '49', '50', '51', '53', '54', '55', '56']

#codelist=[ '21','30','41','44']
#codelist=['42']
#36,48
df_cd =  gpd.read_file('cd_us.shp')

for code in codelist:
    df_vtd = gpd.read_file(os.path.join('/home/zachary/Downloads/zips/tl_2013_'+code+'_cousub.shp'))

    df_vtd['dummy']=1

    print("aggregating")
    (df_vtd,new_tar) = areal.aggregate(df_vtd,df_cd,['dummy'],['STATECD'])
    print("sorting")
    df_vtd.sort_values('STATECD')



    dists = list(set(df_vtd.loc[:,'STATECD']))
    dists.sort()

    rWlist = []
    print("doing spatial indx")
    for d in dists:
        m=df_vtd.loc[df_vtd.loc[:,'STATECD']==d]
        f = open('spatial_indexes/'+code+'_'+d+'_idx.txt','w')
        for ind,row in m.iterrows():
            print(ind)
            
            f.write(row['GEOID']+','+str(m.centroid[ind].x)+','+str(m.centroid[ind].y)+'\n' )
        print(f.tell())
        f.truncate(f.tell()-1)
        f.close()

        



        
