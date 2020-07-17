package internal

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"testing"
)

func loadRecordsFromCollection(t *testing.T, collectionName string, outSlice interface{}) {
	cursor := cursorForCollection(t, collectionName)
	pullFromCursor(t, cursor, outSlice)
}

func cursorForCollection(t *testing.T, collectionName string) *mongo.Cursor {
	collection := dutyDB().Collection(collectionName)
	cursor, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		t.Errorf("MongoDB find error: %s", err)
	}
	return cursor
}

func dutyDB() *mongo.Database {
	return client.Database("dutyDB")
}

func pullFromCursor(t *testing.T, cursor *mongo.Cursor, results interface{}) {
	err := cursor.All(context.TODO(), results)
	if err != nil {
		t.Errorf("MongoDB load error: %s", err)
	}
}

