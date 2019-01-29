import 'babel-polyfill';
import DirectusSDK from '@directus/sdk-js';
import Colors from 'colors'; // eslint-disable-line

/**
 * Class with methods for fetching data from Directus
 * via their JS SDK
 */
export default class DirectusFetcher {
    constructor(url, project, email, password) {
        try {
            this.client = new DirectusSDK({
                url,
                project: project || '_',
            });

            if (email && password) {
                this.client.login({
                    email,
                    password,
                });
            }
        } catch (e) {
            console.error(
                `\ngatsby-source-directus`.blue,
                'error'.red,
                `gatsby-source-directus: Error initializing DirectusFetcher:\n${e}`,
            );
        }
    }

    /**
     * Fetch all Collections from Directus excluding system
     * collections (ie. those prefixed with "directus_")
     */
    async getAllCollections() {
        try {
            const collectionsData = await this.client.getCollections();
            // Directus API doesn't support filtering collections on requests
            // so this will do
            const collections = collectionsData.data.filter(
                collection => !collection.collection.startsWith('directus_'),
            );
            return collections;
        } catch (e) {
            console.error(
                `\ngatsby-source-directus`.blue,
                'error'.red,
                `gatsby-source-directus: Error while fetching Collections:\n${e}`,
            );
            return [];
        }
    }

    /**
     * Fetch all Relations from Directus excluding system
     * relations (ie. those prefixed with "directus_")
     */
    async getAllRelations() {
        try {
            const relationsData = await this.client.getRelations({
                filter: { collection_many: { nlike: 'directus_' } },
            });
            return relationsData.data;
        } catch (e) {
            console.error(
                `\ngatsby-source-directus`.blue,
                'error'.red,
                `gatsby-source-directus: Error while fetching Relations:\n${e}`,
            );
            return [];
        }
    }

    /**
     * Fetch all Items in a collection
     */
    async getItemsForCollection(collectionName) {
        try {
            const itemsData = await this.client.getItems(collectionName);
            return itemsData.data;
        } catch (e) {
            console.error(
                `\ngatsby-source-directus`.blue,
                'error'.red,
                `gatsby-source-directus: Error while fetching collection ${collectionName}:\n${e}`,
            );
            return [];
        }
    }

    /**
     * Fetch all files from Directus
     */
    async getAllFiles() {
        try {
            // Directus SDK doesn't yet support fetching files via a
            // dedicated method yet but this works just as well
            const filesData = await this.client.get('files');
            return filesData.data;
        } catch (e) {
            console.error(
                `\ngatsby-source-directus`.blue,
                'error'.red,
                `gatsby-source-directus: Error while fetching files:\n${e}`,
            );
            return [];
        }
    }
}
