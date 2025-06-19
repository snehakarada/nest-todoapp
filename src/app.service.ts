import { Injectable } from '@nestjs/common';


interface Task {
  id: number,
  name: string,
  isDone: Boolean
}

interface List {
  id: number,
  listName: string,
  tasks: Task[]
}

interface user {
  name: string,
  tasks: List[]
}

interface listResponse {
  isUserThere: Boolean,
  list: object
}

@Injectable()
export class AppService {
  users: user[] = []
  listCounter: number = 0
  taskCounter: number = 0

  addUser(userName: string): void {
    this.users.push({ name: userName, tasks: [] })
  }

  deleteUser(userName: string): void {
    const userIndex = this.findUserIndex(userName)
    this.users.splice(userIndex, 1)
  }

  serveList(userName: string): listResponse {
    const userIndex = this.findUserIndex(userName)
    return userIndex < 0 ? { isUserThere: false, list: {} } : { isUserThere: true, list: this.users[userIndex] }
  }

  saveList(listname: string, userName: string): void {
    this.listCounter += 1
    const userIndex = this.findUserIndex(userName)
    this.users[userIndex]["tasks"].push({ id: this.listCounter, listName: listname, tasks: [] })
  }

  deleteList(id: string, userName: string): void {
    const listIndex = this.findListIndex(id, userName)
    const userIndex = this.findUserIndex(userName)
    this.users[userIndex]["tasks"].splice(listIndex, 1)
  }

  saveTask(id: string, taskName: string, userName: string): void {
    this.taskCounter += 1
    const userIndex = this.findUserIndex(userName)
    const listIndex = this.findListIndex(id, userName)
    this.users[userIndex]["tasks"][listIndex].tasks.push({ id: this.taskCounter, name: taskName, isDone: false })
  }

  toggleTask(id: string, taskId: string, userName: string): void {
    const listIndex = this.findListIndex(id, userName)
    const userIndex = this.findUserIndex(userName)
    const taskIndex = this.findTaskIndex(this.users[userIndex]["tasks"][listIndex], taskId)
    const task = this.users[userIndex]["tasks"][listIndex].tasks[taskIndex]
    task.isDone = task.isDone ? false : true
  }

  deleteTask(id: string, taskId: string, userName: string): void {
    const listIndex = this.findListIndex(id, userName)
    const userIndex = this.findUserIndex(userName)
    const taskIndex = this.findTaskIndex(this.users[userIndex]["tasks"][listIndex], taskId)
    this.users[userIndex]["tasks"][listIndex].tasks.splice(taskIndex, 1)
  }

  findListIndex(id: string, userName: string) {
    const userIndex = this.findUserIndex(userName)
    return this.users[userIndex]["tasks"].findIndex((task) => (task.id + '') === id)
  }

  findTaskIndex(list, taskId: string) {
    return list.tasks.findIndex((task) => ((task.id + '') === taskId))
  }

  findUserIndex(userName: string): number {
    return this.users.findIndex(({ name, tasks }) => name === userName)
  }

}
