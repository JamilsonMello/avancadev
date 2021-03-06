package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"

	"github.com/wesleywillians/go-rabbitmq/queue"

	"github.com/streadway/amqp"

	"github.com/joho/godotenv"
	uuid "github.com/satori/go.uuid"
)

type Result struct {
	Status string
}

type Order struct {
	ID       uuid.UUID
	Coupon   string
	CcNumber string
}

const (
	InvalidCoupon   = "invalid"
	ValidCoupon     = "valid"
	ConnectionError = "connection error"
)

func NewOrder() Order {
	return Order{ID: uuid.NewV4()}
}

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("File dotenv not loaded")
	}
}

func main() {
	messageChannel := make(chan amqp.Delivery)

	rabbitMQ := queue.NewRabbitMQ()
	ch := rabbitMQ.Connect()
	defer ch.Close()

	rabbitMQ.Consume(messageChannel)

	for msg := range messageChannel {
		process(msg)
	}
}

func process(msg amqp.Delivery) {
	order := NewOrder()
	json.Unmarshal(msg.Body, &order)

	resultCoupon := makeHttpCall("http://localhost:9092", order.Coupon)

	switch resultCoupon.Status {
	case InvalidCoupon:
		log.Println("Order: ", order.ID, ": invalid coupon!")

	case ConnectionError:
		msg.Reject(false)
		log.Println("Order: ", order.ID, ": could not process!")

	case ValidCoupon:
		log.Println("Order: ", order.ID, ": Processed!")
	}

}

func makeHttpCall(urlMicroservice string, coupon string) Result {

	values := url.Values{}
	values.Add("coupon", coupon)

	res, err := http.PostForm(urlMicroservice, values)
	if err != nil {
		result := Result{Status: ConnectionError}
		return result
	}

	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal("Error processing result")
	}

	result := Result{}

	json.Unmarshal(data, &result)

	return result

}
