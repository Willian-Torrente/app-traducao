import amqplib, { Connection, Channel } from 'amqplib';

let channel: Channel | null = null;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

export async function initRabbitMQ(): Promise<void> {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ Connection to RabbitMQ has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to RabbitMQ:', error);
    throw error;
  }
}

export function publishToQueue(queue: string, message: string): boolean {
  if (!channel) {
    console.error('Channel not established. Cannot publish message.');
    return false;
  }
  try {
    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`[RabbitMQ] Sent to queue '${queue}': ${message}`);
    return true;
  } catch (error) {
    console.error(`Error publishing to queue ${queue}:`, error);
    return false;
  }
}