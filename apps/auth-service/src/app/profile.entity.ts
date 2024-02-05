import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    index: number

  public GetPicturePath(): string {
    let i = 0;
    const assetFolder = '../static/profiles';
    const fs = require('fs');

    fs.readdir(assetFolder, (err, files) => {
      files.forEach(file => {
        if (i == this.index) {
          return file;
        }
      });
    });
    return "";
  }

}
