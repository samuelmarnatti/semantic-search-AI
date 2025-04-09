import path from "node:path";

import  { DiretoryLoader} from "langchain/document_loaders/fs/directory";
import  { JSONLoader} from "langchain/document_loaders/fs/json";
import { TolkenTextSplitter } from "langchain/text_splitter";
// import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";

// /**
//  * Loader uses `page.evaluate(() => document.body.innerHTML)`
//  * as default evaluate function
//  **/
// const loader = new PuppeteerWebBaseLoader("https://www.tabnews.com.br/");

// const docs = await loader.load();

const loader = new DiretoryLoader(
  path.resolve(__dirname,  '../tmp'),
  {
    '.json': path => new JSONLoader(path, '/text')
  }
)

async function load() {
  const docs = await loader.load()
  const splitter = new TolkenTextSplitter({
      encodingName: 'cl100k_base',
      chunkSIze:600,
      chunkOverLap: 0,
  })
  const splittedDocuments = await splitter.splitDocuments(docs)
}
load()