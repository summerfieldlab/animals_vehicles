import pickle
import numpy as np 

import pandas as pd 
from scipy import stats
import os 
from copy import deepcopy
import re

import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.tokenize import word_tokenize 
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import gensim
from gensim.models import CoherenceModel, LdaMulticore

from wordcloud import STOPWORDS, WordCloud

import warnings
warnings.filterwarnings('ignore')

# set a few parameters 
working_dir = os.getcwd()
data_dir = working_dir + '/data/'
domains = ['animals','vehicles']
curricula = ['blocked','interleaved']
rules = ['resp_ruleSpeed','resp_ruleSize']

# LDA params
n_workers = 28 # number of workers for ldamulticore
n_topics  = np.arange(2,22)




def remove_stopwords(string,stopwords):
    '''
    removes stopwords from string
    '''
    # tokenise
    string = word_tokenize(string)
    # only keep non stopwords
    string = ' '.join([w for w in string if not w in stopwords])
    return string


def lemmatise(string):
    '''
    lemmatises words in sentence
    '''
    # tokenise the sentence
    string = word_tokenize(string)
    # lemmatise each word in sentence
    lemmatiser = WordNetLemmatizer()
    string = [lemmatiser.lemmatize(w,pos='n') for w in string]
    string = [lemmatiser.lemmatize(w,pos='v') for w in string]
    string = [lemmatiser.lemmatize(w,pos='a') for w in string]
    string = ' '.join(string)
    return string


def cleanup_txtresponses(alldata,whichstopwords='topicmodel'):
    domains = ['animals','vehicles']
    curricula = ['blocked','interleaved']
    rules = ['resp_ruleSpeed','resp_ruleSize']
    alldata2 = deepcopy(alldata)
    # stopwords: some standard stopwords of english language
    # sws = set(stopwords.words('english'))
    sws = set(STOPWORDS)
    # stopwords: task specific stopwords
    if whichstopwords=='wordcloud':
        sws.update(['animal','vehicle','orange','blue','store','think','reward','rule','accept','reject','remember','point',':','&',',','.','!','?','/','-','(',')',"n't",'=',"'","'m","'s",'+','wa'])
    elif whichstopwords=='topicmodel':
        sws.update([':','&',',','.','!','?','/','-','(',')',"n't",'=',"'","'m","'s",'+','wa'])

    for dom in domains:
        for cur in curricula:
            for rule in rules:
                for idx,string in enumerate(alldata[dom][cur][rule]):
                    # remove leading/trialing white space, remove newline escape char, all lower case
                    string =  string.strip().replace('\n',' ').lower()
                    string = string.replace('/',' ')
                    # lemmatisation
                    string = lemmatise(string)
                    # remove stopwords
                    string = remove_stopwords(string,sws)
                    # tokenisation
                    string = word_tokenize(string)
                    # remove leading hyphen
                    string = [re.sub('^-','',w) for w in string]
                    # remove trailing hyphen
                    string = [re.sub('-$','',w) for w in string]
                    # remove sequence of fullstops (of any length)
                    string = [re.sub('([.])*','',w) for w in string]
                    # remove empty strings
                    while "" in string:
                        string.remove("")
                    # store cleaned string in list
                    alldata2[dom][cur][rule][idx] = string
                    
    return alldata2


def make_dict_and_corpus(txt):
    '''
    generates dictionary, bag of words and word occurence matrix
    input: document with tokenised texts (list of lists)
    '''
    dictionary = gensim.corpora.Dictionary(txt)
    bow_corpus = [dictionary.doc2bow(doc,allow_update=True) for doc in txt]
    id_words = [[(dictionary[id],count) for id,count in line] for line in bow_corpus]
    return dictionary, bow_corpus, id_words


def compute_perplexity(lda_model,corpus):
    return lda_model.log_perplexity(corpus)

def compute_coherence_score(model,txt,dictionary):
    '''
    calculates coherence score.
    score > 0.5 acceptable
    score > 0.7 good
    '''
    coherence_model = CoherenceModel(model=model,texts=txt,dictionary=dictionary,coherence='c_v')
    coherence = coherence_model.get_coherence()
    return coherence



def main():

    
    # load data 
    with open('animals_vehicles_pilot.pkl','rb') as f:
        alldata = pickle.load(f)

    # preprocess data
    alldata_cleaned = cleanup_txtresponses(alldata,whichstopwords='topicmodel')
    # concatenate responses for all rules/domains etc
    txt_orig = []
    txt_tokenised = []
    for dom in domains:
        for cur in curricula:
            for rule in rules:
                txt_orig = txt_orig + alldata[dom][cur][rule]
                txt_tokenised = txt_tokenised + alldata_cleaned[dom][cur][rule]

    # Build the bigram and trigram models
    bigram = gensim.models.Phrases(txt_tokenised, min_count=3, threshold=1) # higher threshold fewer phrases.
    trigram = gensim.models.Phrases(bigram[txt_tokenised], threshold=1)  

    # Faster way to get a sentence clubbed as a trigram/bigram
    bigram_mod = gensim.models.phrases.Phraser(bigram)
    trigram_mod = gensim.models.phrases.Phraser(trigram)


    def make_bigrams(texts):
        return [bigram_mod[doc] for doc in texts]

    def make_trigrams(texts):
        return [trigram_mod[bigram_mod[doc]] for doc in texts]


    # turn bow into bigrams or trigrams
    txt_trigrammed = make_trigrams(txt_tokenised)


    # run lda 
    # instantiate collector variables
    models = [] # store best models (across runs) here
    coherence_scores = []
    perplexity_scores = []


    dictionary, bow_corpus, id_words = make_dict_and_corpus(txt_trigrammed)
    for ii,ntop in enumerate(n_topics):
        print('run ' + str(ii+1) + '/' + str(len(n_topics)))
        lda_model =  gensim.models.LdaMulticore(bow_corpus, 
                num_topics = ntop, 
                id2word = dictionary,                                    
                passes = 500,
                workers = n_workers)
        perplexity_scores.append(compute_perplexity(lda_model,bow_corpus))
        coherence_scores.append(compute_coherence_score(lda_model,txt_tokenised,dictionary))
        models.append(lda_model)
                    

                        
    lda_results = {'models':models,
                    'coherence':coherence_scores,
                    'perplexity':perplexity_scores,
                    'n_topics':n_topics}
    with open('lda_results_trigram.pkl','wb') as f:
        pickle.dump(lda_results,f)




if __name__ == "__main__":
    main()