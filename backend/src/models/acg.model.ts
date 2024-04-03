import { createConnection, Schema } from 'mongoose';
const databaseUri = process.env.NODE_ENV === "production" ? process.env.MONGO_ATLAS_NGSAMPLER_URI : process.env.NOVEL_BIN_URI;
const novelBinCon = createConnection(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true });


const novelSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  author: String,
  genre: [String],
  source: String,
  status: { type: [String], enum: ['Complete', 'In Progress', 'On Hold'] },
}, { collection: 'novels' });

const chapterSchema = new Schema({
  title: String,
  description: String,
  content: String,
  novel_id: String
}, { collection: 'chapters' })

export const Novel = novelBinCon.model('Novel', novelSchema);
export const Chapter = novelBinCon.model('Chapter', chapterSchema);



export const saveNovel = (values: Record<string, any>) => Novel.create(values);
export const getNovels = () => Novel.find();
export const getNovelById = (id: string) => Novel.findById({ _id: id });
// export const patchOneNovel = (id: string, values: Record<string, any>) => Novel.findOneAndUpdate({ _id: id, values });
export const deleteNovelById = (id: string) => Novel.findOneAndRemove({ _id: id });

export const getAllChaptersByNovelId = (novelId: string) => Chapter.find({ novel_id: novelId }).limit(3)
export const getByNovelIdAndChapter = (novelId: string, chapterNumber: string) => Chapter.find({ novel_id: novelId, description: chapterNumber })
export const putChapter = (id: string, values: Record<string, any>) => Chapter.replaceOne({ id, values });
export const gettingTableOfContents = (novelId: string) => Chapter.find({ novel_id: novelId }, { description: 1 });