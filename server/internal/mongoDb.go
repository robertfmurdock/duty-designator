package internal

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
)

func insertIntoCollection(database *mongo.Database, record interface{}, collectionName string) error {
	choreCollection := database.Collection(collectionName)
	_, err := choreCollection.InsertOne(context.Background(), record)
	return err
}

