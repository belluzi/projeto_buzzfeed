import { Component } from '@angular/core';
import quizz_questions from '../../../../public/data/quizz_questions.json';

@Component({
  selector: 'app-quizz',
  standalone: false,
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css',
})
export class QuizzComponent {
  title: string = '';

  questions: any;
  selectedQuestion: any;

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() {}
  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.selectedQuestion = this.questions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;
    }
  }

  playerChoice(value: string) {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.selectedQuestion = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);

      this.finished = true;
      this.answerSelected =
        quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
      this.checkResult(this.answers);
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((prev, current, index, array) => {
      if (
        array.filter((item) => item === prev).length >
        array.filter((item) => item === current).length
      ) {
        return prev;
      } else {
        return current;
      }
    });

    return result;
  }
}
