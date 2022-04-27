"""
a few helper functions
Timo Flesch, 2020
"""

import numpy as np
import matplotlib.pyplot as plt

from scipy.spatial.distance import squareform, pdist
from mpl_toolkits.mplot3d import Axes3D 

def plot_grid3(xyz,line_colour='green',line_width=2,fig_id=1):
    # %matplotlib qt    
    x,y = np.meshgrid(np.arange(0,5),np.arange(0,5))
    x = x.flatten()
    y = y.flatten()
    try: xyz 
    except NameError: xyz = np.stack((x,y,np.ones((25,))),axis=1)
    bl = np.stack((x,y),axis=1)
    plt.figure(fig_id)    
    ax = plt.gca()
    for ii in range(0,4):
        for jj in range(0,4):
            p1 = xyz[(bl[:,0]==ii) & (bl[:,1]==jj),:].ravel()
            p2 = xyz[(bl[:,0]==ii+1) & (bl[:,1]==jj),:].ravel()        
            plt.plot([p1[0],p2[0]],[p1[1],p2[1]],[p1[2],p2[2]],linewidth=line_width,color=line_colour)
            p2 = xyz[(bl[:,0]==ii) & (bl[:,1]==jj+1),:].ravel()
            plt.plot([p1[0],p2[0]],[p1[1],p2[1]],[p1[2],p2[2]],linewidth=line_width,color=line_colour)
    ii = 4
    for jj in range(0,4):
        p1 = xyz[(bl[:,0]==ii) & (bl[:,1]==jj),:].ravel()
        p2 = xyz[(bl[:,0]==ii) & (bl[:,1]==jj+1),:].ravel()
        plt.plot([p1[0],p2[0]],[p1[1],p2[1]],[p1[2],p2[2]],linewidth=line_width,color=line_colour)

    jj = 4
    for ii in range(0,4):
        p1 = xyz[(bl[:,0]==ii) & (bl[:,1]==jj),:].ravel()
        p2 = xyz[(bl[:,0]==ii+1) & (bl[:,1]==jj),:].ravel()
        plt.plot([p1[0],p2[0]],[p1[1],p2[1]],[p1[2],p2[2]],linewidth=line_width,color=line_colour)
    ax.axes.xaxis.set_ticklabels([])
    ax.axes.yaxis.set_ticklabels([])
    ax.axes.zaxis.set_ticklabels([])
#     ax.set_xlim([-2,2])
#     ax.set_ylim([-2,2])
#     ax.set_zlim([-2,2])
   

def scatter_mds_3(xyz,task_id='a',fig_id=1):
    if task_id=='both':
        n_items = 50
        ctxMarkerEdgeCol = [(0,0,.5),'orange']
    elif task_id=='a':
        n_items = 25
        ctxMarkerEdgeCol = (0,0,.5)
    elif task_id=='b':
        ctxMarkerEdgeCol = 'orange'
    elif task_id == 'avg':
        n_items = 50
        ctxMarkerEdgeCol = None
    elif task_id == 'four':
        n_items = 100
        ctxMarkerEdgeCol = [(0,0,.5),'orange', 'red', 'green']

    ctxMarkerCol = 'white'
    ctxMarkerSize = 20
    itemMarkerSize = 2
    scat_b = np.arange(5,15,2)
    # scat_l = np.array([[50, 56, 168], [118, 46, 166], [158, 47, 168], [161, 43, 120], [176, 40, 65]])/255
    scat_l = np.array([[3,252,82], [3,252,177], [3,240,252], [3,152,252], [3,73,252]])/255

    b,l = np.meshgrid(np.arange(0,5),np.arange(0,5))
    b = b.flatten()
    l = l.flatten()   
    x = xyz[:,0]
    y = xyz[:,1]
    z = xyz[:,2]
    
    
    fig = plt.figure(fig_id)
    ax = plt.gca()
    if task_id == 'both':
        b = np.concatenate((b,b),axis=0)
        l = np.concatenate((l,l),axis=0)
        
        for ii in range(0,n_items//2):
            
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol[0],markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='h',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]])
        for ii in range(n_items//2,n_items):
            
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol[1],markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='h',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]])
    
    elif task_id == 'four':
        b = np.concatenate((b,b,b,b),axis=0)
        l = np.concatenate((l,l,l,l),axis=0)
        
        for ii in range(0,n_items//4):
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol[0],markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='h',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]])    
        for ii in range(n_items//4,n_items//2):
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol[1],markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='o',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]]) 
        for ii in range(n_items//2,3*n_items//4):
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol[2],markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='h',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]]) 
        for ii in range(3*n_items//4,n_items):
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol[3],markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='o',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]]) 
    
    else:
        for ii in range(0,n_items):
            
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='s',markerfacecolor=ctxMarkerCol,markeredgecolor=ctxMarkerEdgeCol,markersize=ctxMarkerSize,markeredgewidth=2)
            plt.plot([x[ii],x[ii]],[y[ii],y[ii]],[z[ii],z[ii]],marker='h',markeredgecolor=scat_l[l[ii],:],markerfacecolor=scat_l[l[ii],:],markersize=scat_b[b[ii]])


