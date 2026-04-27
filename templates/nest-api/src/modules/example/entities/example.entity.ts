import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity('examples')
export class Example {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ default: true })
  active!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date | null
}
