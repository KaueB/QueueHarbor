export interface RedisInstance {
  id: string;
  name: string;
  host: string;
  port: number;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRedisInstanceDto {
  name: string;
  host: string;
  port: number;
  password?: string;
}
