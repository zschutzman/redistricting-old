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

cols=['tab:orange', 'tab:red', 'tab:brown', 'tab:purple', 'tab:blue', 'tab:green', 'tab:pink', 'tab:gray', 'tab:olive', 'tab:cyan']

'''['01', '02', '04', '05', '06',  '08', '09', '10', '11', '12','13',  '15', '16', '17', '18', '19', '20','''
print("opening")
codelist=['31']#, '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '45', '46', '47', '48', '49', '50', '51', '53', '54', '55', '56']


df_cd =  gpd.read_file('cd_us.shp')

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

    rWlist = []
    print("doing CD dual graphs")
    for d in dists:
        m=df_vtd.loc[df_vtd.loc[:,'STATECD']==d]
        rW = ps.weights.Rook.from_dataframe(m)
        rWlist.append(rW)
        w=rW
        #np.savetxt(code+'_'+d+'_dist.txt',rW.full()[0],delimiter=',',fmt='%d')
        
        c_x=m.centroid.x
        c_y = m.centroid.y

        c = cols.pop(0)
        cols.append(c)
        for i,jj in w.neighbors.items(): 
            
            for j in jj:
                basemap_s.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
                basemap_m.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
                basemap_l.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
                       
        

    basemap_s.axis('off')
    basemap_m.axis('off')
    basemap_l.axis('off')



    plt.figure(1)
    plt.savefig(code+'_graph_s.png', bbox_inches='tight', pad_inches=0)
    plt.close()
    plt.savefig(code+'_graph_m.png', bbox_inches='tight', pad_inches=0)
    plt.close()
    plt.savefig(code+'_graph_l.png', bbox_inches='tight', pad_inches=0)
    plt.close()

    

    #plt.show()
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



        
