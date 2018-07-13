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
codelist=['56']



state= sys.argv[1]

df_cd =  gpd.read_file('cd_us.shp')


df_cd['tar_field'] = -1


count = 1
l = []
for ind, row in df_cd.iterrows():
   
    fcode = row['STATECD']
    st = row['STATEFP']
    #print(fcode[0:2]+' ' + fcode[2:]+ ' || ' + str(count) + ' of ' + str(436))
    count += 1
    # open matrix
    if st == state or state=='all':

        adj = np.loadtxt('adj_mats/'+fcode[0:2]+'_'+fcode+'_dist.txt',delimiter=',').astype(int)
        #G=nx.path_graph(500)
        G=nx.from_numpy_matrix(adj)
        spec = nx.estrada_index(G)/len(G.nodes)#/adj.shape[0]

        '''  
        deg = np.diag(adj.sum(axis=0)).astype(int)
        lap = deg-adj
        #print(lap.shape)
        lap = lap.astype(int)    
        m=lap
        
        spec = np.real(scipy.linalg.eigvals(m).tolist())
        #print(np.sum(adj))
        spec.sort()
        #print(spec[0:6])
        
        
        
        spec = [np.log(x) for x in spec if x>0]
        spec = sum(spec)-np.log(adj.shape[0]*.5*np.sum(adj))
        
        
        
        
        x = np.nonzero(spec)[0].tolist()[1] #-np.nonzero(spec)[0].tolist()[0]
        
        spec = x/(np.mean(np.sum(adj,axis=0)))
        
        '''
        #print(spec)
        #spec = np.sort(spec)
        l.append(spec)
    else:
        l.append(0)
    
forbid = ['02','15']    
df_cd['tar_field'] = l
m=df_cd.loc[df_cd.loc[:,'STATEFP'] == state]

'''
m=df_cd.loc[df_cd.loc[:,'STATEFP'] != '02']
m=m.loc[m.loc[:,'STATEFP'] != '15']
m=m.loc[m.loc[:,'STATEFP'] != '34']
m=m.loc[m.loc[:,'STATEFP'] != '25']
m=m.loc[m.loc[:,'STATEFP'] != '44']
m=m.loc[m.loc[:,'STATEFP'] != '41']
m=m.loc[m.loc[:,'STATEFP'] != '56']
'''




fig = m.plot(column = 'tar_field', legend=True,figsize=(12,12) , cmap='plasma_r' )
plt.title('normalized estrada index')
fig.axis('off')
plt.show()


'''
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
    scipy.sparse.save_npz('adj_mats/'+code+'_blocks', mat)
    fullwts = ps.weights.Rook.from_dataframe(df_vtd).full()[0]
    print(type(fullwts))
    fullwts = fullwts.astype(int)
    fullwts = scipy.sparse.coo_matrix(fullwts)
    scipy.sparse.save_npz('adj_mats/'+code+'_full',fullwts)
    
                       
 '''       



    
        



        
