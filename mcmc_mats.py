
# coding: utf-8

# In[1]:


from rundmcmc.chain import MarkovChain
from rundmcmc.make_graph import construct_graph, add_data_to_graph, get_assignment_dict
from rundmcmc.partition import Partition, propose_random_flip
from rundmcmc.updaters import statistic_factory, cut_edges
from rundmcmc.validity import Validator, fast_connected
import geopandas as gp
import networkx as nx
import numpy as np
import areal_interpolation as areal
import scipy.linalg
import scipy.stats
import matplotlib.pyplot as plt
import time
from IPython import display 


def pull_districts(graph, cd_identifier):
    """Creates a dictionary of nodes to their CD.
    :param graph: the graph object you are working on.
    :param cd_identifier: How the congressional district is labeled on your graph.
    :return: A dictionary.
    """
    nodes = {}
    for (p, d) in graph.nodes(data=True):
        nodes[p] = d[cd_identifier]
    return nodes


# In[2]:


df = gp.read_file("./testData/tl_2012_05_vtd10.shp")
df_cd =  gp.read_file('./testData/cd_us.shp')
df['dummy']=-1
df['temp'] = -1
(df,new_tar) = areal.aggregate(df,df_cd,['dummy'],['STATECD'])


# In[3]:


graph = construct_graph(df, geoid_col="GEOID10")
add_data_to_graph(df, graph, ['STATECD', 'ALAND10'], id_col='GEOID10')
assignment = get_assignment_dict(df, "GEOID10", "STATECD")
CDS = set([x for x in assignment.values()])


# In[16]:


def main(steps, interval):
    # Sketch:
    #   1. Load dataframe.
    #   2. Construct neighbor information.
    #   3. Make a graph from this.
    #   4. Throw attributes into graph.

    
    increment  = (0. + interval)/steps
    validator = Validator([fast_connected])

    updaters = {'area': statistic_factory('ALAND10', alias='area'), 'cut_edges': cut_edges}

    initial_partition = Partition(graph, assignment, updaters)
    accept = lambda x: True

    chain = MarkovChain(propose_random_flip, validator, accept,
                        initial_partition, total_steps=steps)#2**15)
    col = (1.,1.,0)
    for step in chain:
        if chain.counter%100 == 0: print("STEP "+ str(chain.counter))
        if chain.counter % interval == 0:
            print("ON STEP " + str(chain.counter))
            plan_graph = nx.Graph()
            for cd in CDS:
                district = [k for k in chain.state.assignment.keys() if chain.state.assignment[k]==cd]
                
                dist_nodes = [x for x,y in graph.nodes(data=True) if x in district]
                
                dist_graph = graph.subgraph(dist_nodes)
                
                plan_graph = nx.union(plan_graph,dist_graph)
            
            #adj = nx.adjacency_matrix(plan_graph)
            
            
            lap = nx.normalized_laplacian_matrix(plan_graph).todense()
            evals = np.real(scipy.linalg.eigvals(lap).tolist())
            evals.sort()
            plt.plot(range(len(evals)),evals,color=col)
            col = (1.,col[1]-increment, col[2]+increment)
            

    
    lap = nx.normalized_laplacian_matrix(graph).todense()
    evals = np.real(scipy.linalg.eigvals(lap).tolist())
    evals.sort()
    plt.plot(range(len(evals)),evals,color='k')
    plt.show()


# In[ ]:


plt.figure(figsize=(12,12))
main(100000,10000)

