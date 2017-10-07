import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RankTransformPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'rankTransform',
})
export class RankTransformPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(rank: number, ...args) {
    switch(rank){
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return rank+'th';
    }    
  }
}
