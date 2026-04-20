import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API!,
});

const index = pinecone.index("messages");


let extractor: FeatureExtractionPipeline | null = null;
const getExtractor = async () => {
    if (!extractor) {
        extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return extractor;
};

const embeddingGenerator = {
    generate: async (texts: string[]): Promise<number[]> => {
        const extractor = await getExtractor();
        const output = await extractor(texts, { pooling: "mean", normalize: true });
        return Array.from(output.data) as number[];
    }
};

export const insertVector = async (message: string, id: string, chatId: string) => {
    try {
        const embedding = await embeddingGenerator.generate([message]);
        console.log(embedding)

        await index.upsert({
            records: [
                {
                    id,
                    values: embedding,
                    metadata: {
                        text: message,
                        sessionId: chatId
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error when inserting vector", error);
        throw error;
    }
}

export const updateVector = async (message: string, id: string, chatId: string) => {
    try {
        const embedding = await embeddingGenerator.generate([message]);
        await index.upsert({
            records: [
                {
                    id,
                    values: embedding,
                    metadata: {
                        text: message,
                        sessionId: chatId
                    }
                }
            ]
        });
    } catch (error) {
        console.error("Error when updating vector", error);
        throw error;
    }
};


export const deleteVector = async (id: string) => {
    try {
        await index.deleteOne({ id });
    } catch (error) {
        console.error("Error when deleting vector", error);
        throw error;
    }
};

export const searchVector = async (
    message: string,
    chatId: string,
    topK: number = 5): Promise<string[]> => {
    try {
        const embedding = await embeddingGenerator.generate([message]);
        const result = await index.query({
            topK: topK,
            vector: embedding,

            ...(chatId && {
                filter: { sessionId: { $eq: chatId } }
            })
        });
        return result.matches?.map((match) => match.id) || [];
    } catch (error) {
        console.error("Error when searching vector", error);
        throw error;
    }
};