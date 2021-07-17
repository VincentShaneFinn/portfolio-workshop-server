import { IObserver } from '../interfaces/observers/IObserver';
import { ISubject } from '../interfaces/observers/ISubject';
export class BaseSubject implements ISubject {
    private observers: IObserver[] = [];

    attach(observer: IObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) console.error("Observer already added")
        this.observers.push(observer);
    }

    detach(observer: IObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) console.error("Observer already removed");
        this.observers.splice(observerIndex, 1);
    }

    notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

}