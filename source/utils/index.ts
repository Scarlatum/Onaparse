export namespace utils {

  export function swap<T>(array: [ T, T ]) {

    let mem;

    mem = array[0]; array[0] = array[1]; array[1] = mem;

    return array;

  } 

}