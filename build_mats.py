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






def build_adj_mats(geo_cell_shp, districts, dist_col, name, plots=False):

    """Function which takes in a shapefile consisting of geo_cells and districts, computes an assignment of geo_cells to districts and builds (optionally) adjacency matrices and visualizations of the districts at the level of the geo_cells.

    Arguments
    ---------
    geo_cell_shp: a shapefile containing the geo_cells (vtds, towns, etc)
        
    districts: a shapefile containing the districts (congressional, legislative, etc)
    dist_col: string
        the name of the column in the district shapefile which contains the district names
    name: string
        the naming convention for the output files.  suggestions include the state name or the FIPS code
    plots: boolean default False
        True if you want to generate plots, False if not.  If you only want matrices, set this to False because it
        is by far the slowest part of the code



    """



    print("STARTING")
    df_geo = gpd.read_file(os.path.join(geo_cell_shp))
    df_dist = gpd.read_file(os.path.join(districts))

    df_geo['dummy']=1
    print("AGGREGATING")
    (df_geo,junk) = areal.aggregate(df_geo,df_dist,['dummy'],[dist_col])
    
    df_geo.sort_values(dist_col)
    
    
    if plots:
        geo_cent = df_geo.centroid
        cx = geo_cent.x
        cy = geo_cent.y
        basemap_s  =df_geo.plot(color="white",edgecolor="lightgray")
        basemap_m  =df_geo.plot(color="white",edgecolor="lightgray",figsize=(12,12))
        basemap_l  =df_geo.plot(color="white",edgecolor="lightgray",figsize=(30,30))
        
        
    dists = list(set(df_geo.loc[:,dist_col]))
    dists.sort()
    
    rWlist = []
    print("doing CD dual graphs")
    for d in dists:
        m=df_geo.loc[df_geo.loc[:,dist_col]==d]
        rW = ps.weights.Rook.from_dataframe(m)
        rWlist.append(rW.full()[0])
        w=rW
        np.savetxt(name+'_'+d+'_dist.txt',rW.full()[0],delimiter=',',fmt='%d')
        
        if plots:
            c_x=m.centroid.x
            c_y = m.centroid.y

            c = cols.pop(0)
            cols.append(c)
            for i,jj in w.neighbors.items(): 
                
                for j in jj:
                    basemap_s.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
                    basemap_m.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
                    basemap_l.plot([c_x[i], c_x[j]], [c_y[i], c_y[j]], linestyle = '-', linewidth = 1,color=c)
                       
        
    if plots:
        basemap_s.axis('off')
        basemap_m.axis('off')
        basemap_l.axis('off')



        plt.figure(1)
        plt.savefig(name+'_graph_s.png', bbox_inches='tight', pad_inches=0)
        plt.close()
        plt.savefig(name+'_graph_m.png', bbox_inches='tight', pad_inches=0)
        plt.close()
        plt.savefig(name+'_graph_l.png', bbox_inches='tight', pad_inches=0)
        plt.close()
    print("SAVING")
    print(rWlist)
    print(type(rWlist[0]))
    mat = scipy.sparse.block_diag(rWlist)
    scipy.sparse.save_npz('adj_mats/'+name+'_blocks', mat)
    fullwts = ps.weights.Rook.from_dataframe(df_geo).full()[0]
    fullwts = fullwts.astype(int)
    fullwts = scipy.sparse.coo_matrix(fullwts)
    scipy.sparse.save_npz('adj_mats/'+name+'_full',fullwts)
    
    
if __name__=='__main__':
    build_adj_mats(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],bool(sys.argv[5]))
