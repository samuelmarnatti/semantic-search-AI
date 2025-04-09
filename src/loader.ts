import path from "node:path";

import  { DirectoryLoader} from "langchain/document_loaders/fs/directory";
import  { JSONLoader} from "langchain/document_loaders/fs/json";
import { TokenTextSplitter } from "langchain/text_splitter";
// import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";

// /**
//  * Loader uses `page.evaluate(() => document.body.innerHTML)`
//  * as default evaluate function
//  **/
// const loader = new PuppeteerWebBaseLoader("https://www.tabnews.com.br/");

// const docs = await loader.load();

const loader = new DirectoryLoader(
  path.resolve(__dirname,  '../tmp'),
  {
    '.json': path => new JSONLoader(path, '/text')
  }
)

async function load() {
  const docs = await loader.load()
  const splitter = new TokenTextSplitter({
      encodingName: 'cl100k_base',
      chunkSize:600,
      chunkOverlap: 0,
  })
  const splittedDocuments = await splitter.splitDocuments(docs)
  console.log(splittedDocuments);
}
load()