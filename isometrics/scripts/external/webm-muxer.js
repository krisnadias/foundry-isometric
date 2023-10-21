"use strict";
var WebMMuxer = (() => {
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __pow = Math.pow;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues = (a, b) => {
        for (var prop in b ||= {})
            if (__hasOwnProp.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
            for (var prop of __getOwnPropSymbols(b)) {
                if (__propIsEnum.call(b, prop))
                    __defNormalProp(a, prop, b[prop]);
            }
        return a;
    };
    var __export = (target, all) => {
        for (var name in all)
            __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
            for (let key of __getOwnPropNames(from))
                if (!__hasOwnProp.call(to, key) && key !== except)
                    __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var __accessCheck = (obj, member, msg) => {
        if (!member.has(obj))
            throw TypeError("Cannot " + msg);
    };
    var __privateGet = (obj, member, getter) => {
        __accessCheck(obj, member, "read from private field");
        return getter ? getter.call(obj) : member.get(obj);
    };
    var __privateAdd = (obj, member, value) => {
        if (member.has(obj))
            throw TypeError("Cannot add the same private member more than once");
        member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    var __privateSet = (obj, member, value, setter) => {
        __accessCheck(obj, member, "write to private field");
        setter ? setter.call(obj, value) : member.set(obj, value);
        return value;
    };
    var __privateMethod = (obj, member, method) => {
        __accessCheck(obj, member, "access private method");
        return method;
    };

    // src/main.ts
    var main_exports = {};
    __export(main_exports, {
        default: () => main_default
    });

    // src/ebml.ts
    var EBMLFloat32 = class {
        constructor(value) {
            this.value = value;
        }
    };
    var EBMLFloat64 = class {
        constructor(value) {
            this.value = value;
        }
    };
    var measureUnsignedInt = (value) => {
        if (value < 1 << 8) {
            return 1;
        } else if (value < 1 << 16) {
            return 2;
        } else if (value < 1 << 24) {
            return 3;
        } else if (value < __pow(2, 32)) {
            return 4;
        } else if (value < __pow(2, 40)) {
            return 5;
        } else {
            return 6;
        }
    };
    var measureEBMLVarInt = (value) => {
        if (value < (1 << 7) - 1) {
            return 1;
        } else if (value < (1 << 14) - 1) {
            return 2;
        } else if (value < (1 << 21) - 1) {
            return 3;
        } else if (value < (1 << 28) - 1) {
            return 4;
        } else if (value < __pow(2, 35) - 1) {
            return 5;
        } else if (value < __pow(2, 42) - 1) {
            return 6;
        } else {
            throw new Error("EBML VINT size not supported " + value);
        }
    };

    // src/write_target.ts
    var _helper, _helperView, _writeFloat32, writeFloat32_fn, _writeFloat64, writeFloat64_fn, _writeUnsignedInt, writeUnsignedInt_fn, _writeString, writeString_fn;
    var WriteTarget = class {
        constructor() {
            __privateAdd(this, _writeFloat32);
            __privateAdd(this, _writeFloat64);
            __privateAdd(this, _writeUnsignedInt);
            __privateAdd(this, _writeString);
            this.pos = 0;
            __privateAdd(this, _helper, new Uint8Array(8));
            __privateAdd(this, _helperView, new DataView(__privateGet(this, _helper).buffer));
            this.offsets = /* @__PURE__ */ new WeakMap();
            this.dataOffsets = /* @__PURE__ */ new WeakMap();
        }
        writeEBMLVarInt(value, width = measureEBMLVarInt(value)) {
            let pos = 0;
            switch (width) {
                case 1:
                    __privateGet(this, _helperView).setUint8(pos++, 1 << 7 | value);
                    break;
                case 2:
                    __privateGet(this, _helperView).setUint8(pos++, 1 << 6 | value >> 8);
                    __privateGet(this, _helperView).setUint8(pos++, value);
                    break;
                case 3:
                    __privateGet(this, _helperView).setUint8(pos++, 1 << 5 | value >> 16);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                    __privateGet(this, _helperView).setUint8(pos++, value);
                    break;
                case 4:
                    __privateGet(this, _helperView).setUint8(pos++, 1 << 4 | value >> 24);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 16);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                    __privateGet(this, _helperView).setUint8(pos++, value);
                    break;
                case 5:
                    __privateGet(this, _helperView).setUint8(pos++, 1 << 3 | value / __pow(2, 32) & 7);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 24);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 16);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                    __privateGet(this, _helperView).setUint8(pos++, value);
                    break;
                case 6:
                    __privateGet(this, _helperView).setUint8(pos++, 1 << 2 | value / __pow(2, 40) & 3);
                    __privateGet(this, _helperView).setUint8(pos++, value / __pow(2, 32) | 0);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 24);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 16);
                    __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                    __privateGet(this, _helperView).setUint8(pos++, value);
                    break;
                default:
                    throw new Error("Bad EBML VINT size " + width);
            }
            this.write(__privateGet(this, _helper).subarray(0, pos));
        }
        writeEBML(data) {
            var _a, _b;
            if (data === null)
                return;
            if (data instanceof Uint8Array) {
                this.write(data);
            } else if (Array.isArray(data)) {
                for (let elem of data) {
                    this.writeEBML(elem);
                }
            } else {
                this.offsets.set(data, this.pos);
                __privateMethod(this, _writeUnsignedInt, writeUnsignedInt_fn).call(this, data.id);
                if (Array.isArray(data.data)) {
                    let sizePos = this.pos;
                    let sizeSize = (_a = data.size) != null ? _a : 4;
                    this.seek(this.pos + sizeSize);
                    let startPos = this.pos;
                    this.dataOffsets.set(data, startPos);
                    this.writeEBML(data.data);
                    let size = this.pos - startPos;
                    let endPos = this.pos;
                    this.seek(sizePos);
                    this.writeEBMLVarInt(size, sizeSize);
                    this.seek(endPos);
                } else if (typeof data.data === "number") {
                    let size = (_b = data.size) != null ? _b : measureUnsignedInt(data.data);
                    this.writeEBMLVarInt(size);
                    __privateMethod(this, _writeUnsignedInt, writeUnsignedInt_fn).call(this, data.data, size);
                } else if (typeof data.data === "string") {
                    this.writeEBMLVarInt(data.data.length);
                    __privateMethod(this, _writeString, writeString_fn).call(this, data.data);
                } else if (data.data instanceof Uint8Array) {
                    this.writeEBMLVarInt(data.data.byteLength, data.size);
                    this.write(data.data);
                } else if (data.data instanceof EBMLFloat32) {
                    this.writeEBMLVarInt(4);
                    __privateMethod(this, _writeFloat32, writeFloat32_fn).call(this, data.data.value);
                } else if (data.data instanceof EBMLFloat64) {
                    this.writeEBMLVarInt(8);
                    __privateMethod(this, _writeFloat64, writeFloat64_fn).call(this, data.data.value);
                }
            }
        }
    };
    _helper = new WeakMap();
    _helperView = new WeakMap();
    _writeFloat32 = new WeakSet();
    writeFloat32_fn = function(value) {
        __privateGet(this, _helperView).setFloat32(0, value, false);
        this.write(__privateGet(this, _helper).subarray(0, 4));
    };
    _writeFloat64 = new WeakSet();
    writeFloat64_fn = function(value) {
        __privateGet(this, _helperView).setFloat64(0, value, false);
        this.write(__privateGet(this, _helper));
    };
    _writeUnsignedInt = new WeakSet();
    writeUnsignedInt_fn = function(value, width = measureUnsignedInt(value)) {
        let pos = 0;
        switch (width) {
            case 6:
                __privateGet(this, _helperView).setUint8(pos++, value / __pow(2, 40) | 0);
            case 5:
                __privateGet(this, _helperView).setUint8(pos++, value / __pow(2, 32) | 0);
            case 4:
                __privateGet(this, _helperView).setUint8(pos++, value >> 24);
            case 3:
                __privateGet(this, _helperView).setUint8(pos++, value >> 16);
            case 2:
                __privateGet(this, _helperView).setUint8(pos++, value >> 8);
            case 1:
                __privateGet(this, _helperView).setUint8(pos++, value);
                break;
            default:
                throw new Error("Bad UINT size " + width);
        }
        this.write(__privateGet(this, _helper).subarray(0, pos));
    };
    _writeString = new WeakSet();
    writeString_fn = function(str) {
        this.write(new Uint8Array(str.split("").map((x) => x.charCodeAt(0))));
    };
    var _buffer, _bytes;
    var ArrayBufferWriteTarget = class extends WriteTarget {
        constructor() {
            super();
            __privateAdd(this, _buffer, new ArrayBuffer(__pow(2, 16)));
            __privateAdd(this, _bytes, new Uint8Array(__privateGet(this, _buffer)));
        }
        ensureSize(size) {
            let newLength = __privateGet(this, _buffer).byteLength;
            while (newLength < size)
                newLength *= 2;
            if (newLength === __privateGet(this, _buffer).byteLength)
                return;
            let newBuffer = new ArrayBuffer(newLength);
            let newBytes = new Uint8Array(newBuffer);
            newBytes.set(__privateGet(this, _bytes), 0);
            __privateSet(this, _buffer, newBuffer);
            __privateSet(this, _bytes, newBytes);
        }
        write(data) {
            this.ensureSize(this.pos + data.byteLength);
            __privateGet(this, _bytes).set(data, this.pos);
            this.pos += data.byteLength;
        }
        seek(newPos) {
            this.pos = newPos;
        }
        finalize() {
            this.ensureSize(this.pos);
            return __privateGet(this, _buffer).slice(0, this.pos);
        }
    };
    _buffer = new WeakMap();
    _bytes = new WeakMap();
    var FILE_CHUNK_SIZE = __pow(2, 24);
    var MAX_CHUNKS_AT_ONCE = 2;
    var _stream, _chunks;
    var FileSystemWritableFileStreamWriteTarget = class extends WriteTarget {
        constructor(stream) {
            super();
            __privateAdd(this, _stream, void 0);
            __privateAdd(this, _chunks, []);
            __privateSet(this, _stream, stream);
        }
        write(data) {
            this.writeDataIntoChunks(data, this.pos);
            this.flushChunks();
            this.pos += data.byteLength;
        }
        writeDataIntoChunks(data, position) {
            let chunkIndex = __privateGet(this, _chunks).findIndex((x) => x.start <= position && position < x.start + FILE_CHUNK_SIZE);
            if (chunkIndex === -1)
                chunkIndex = this.createChunk(position);
            let chunk = __privateGet(this, _chunks)[chunkIndex];
            let relativePosition = position - chunk.start;
            let toWrite = data.subarray(0, Math.min(FILE_CHUNK_SIZE - relativePosition, data.byteLength));
            chunk.data.set(toWrite, relativePosition);
            let section = {
                start: relativePosition,
                end: relativePosition + toWrite.byteLength
            };
            insertSectionIntoFileChunk(chunk, section);
            if (chunk.written[0].start === 0 && chunk.written[0].end === FILE_CHUNK_SIZE) {
                chunk.shouldFlush = true;
            }
            if (__privateGet(this, _chunks).length > MAX_CHUNKS_AT_ONCE) {
                for (let i = 0; i < __privateGet(this, _chunks).length - 1; i++) {
                    __privateGet(this, _chunks)[i].shouldFlush = true;
                }
                this.flushChunks();
            }
            if (toWrite.byteLength < data.byteLength) {
                this.writeDataIntoChunks(data.subarray(toWrite.byteLength), position + toWrite.byteLength);
            }
        }
        createChunk(includesPosition) {
            let start = Math.floor(includesPosition / FILE_CHUNK_SIZE) * FILE_CHUNK_SIZE;
            let chunk = {
                start,
                data: new Uint8Array(FILE_CHUNK_SIZE),
                written: [],
                shouldFlush: false
            };
            __privateGet(this, _chunks).push(chunk);
            __privateGet(this, _chunks).sort((a, b) => a.start - b.start);
            return __privateGet(this, _chunks).indexOf(chunk);
        }
        flushChunks(force = false) {
            for (let i = 0; i < __privateGet(this, _chunks).length; i++) {
                let chunk = __privateGet(this, _chunks)[i];
                if (!chunk.shouldFlush && !force)
                    continue;
                for (let section of chunk.written) {
                    __privateGet(this, _stream).write({
                        type: "write",
                        data: chunk.data.subarray(section.start, section.end),
                        position: chunk.start + section.start
                    });
                }
                __privateGet(this, _chunks).splice(i--, 1);
            }
        }
        seek(newPos) {
            this.pos = newPos;
        }
        finalize() {
            this.flushChunks(true);
        }
    };
    _stream = new WeakMap();
    _chunks = new WeakMap();
    var insertSectionIntoFileChunk = (chunk, section) => {
        let low = 0;
        let high = chunk.written.length - 1;
        let index = -1;
        while (low <= high) {
            let mid = Math.floor(low + (high - low + 1) / 2);
            if (chunk.written[mid].start <= section.start) {
                low = mid + 1;
                index = mid;
            } else {
                high = mid - 1;
            }
        }
        chunk.written.splice(index + 1, 0, section);
        if (index === -1 || chunk.written[index].end < section.start)
            index++;
        while (index < chunk.written.length - 1 && chunk.written[index].end >= chunk.written[index + 1].start) {
            chunk.written[index].end = Math.max(chunk.written[index].end, chunk.written[index + 1].end);
            chunk.written.splice(index + 1, 1);
        }
    };
    var _sections, _onFlush;
    var StreamingWriteTarget = class extends WriteTarget {
        constructor(onFlush) {
            super();
            __privateAdd(this, _sections, []);
            __privateAdd(this, _onFlush, void 0);
            __privateSet(this, _onFlush, onFlush);
        }
        write(data) {
            __privateGet(this, _sections).push({
                data: data.slice(),
                start: this.pos
            });
            this.pos += data.byteLength;
        }
        seek(newPos) {
            this.pos = newPos;
        }
        flush(done) {
            if (__privateGet(this, _sections).length === 0)
                return;
            let chunks = [];
            let sorted = [...__privateGet(this, _sections)].sort((a, b) => a.start - b.start);
            chunks.push({
                start: sorted[0].start,
                size: sorted[0].data.byteLength
            });
            for (let i = 1; i < sorted.length; i++) {
                let lastChunk = chunks[chunks.length - 1];
                let section = sorted[i];
                if (section.start <= lastChunk.start + lastChunk.size) {
                    lastChunk.size = Math.max(lastChunk.size, section.start + section.data.byteLength - lastChunk.start);
                } else {
                    chunks.push({
                        start: section.start,
                        size: section.data.byteLength
                    });
                }
            }
            for (let chunk of chunks) {
                chunk.data = new Uint8Array(chunk.size);
                for (let section of __privateGet(this, _sections)) {
                    if (chunk.start <= section.start && section.start < chunk.start + chunk.size) {
                        chunk.data.set(section.data, section.start - chunk.start);
                    }
                }
                let isLastFlush = done && chunk === chunks[chunks.length - 1];
                __privateGet(this, _onFlush).call(this, chunk.data, chunk.start, isLastFlush);
            }
            __privateGet(this, _sections).length = 0;
        }
    };
    _sections = new WeakMap();
    _onFlush = new WeakMap();

    // src/main.ts
    var VIDEO_TRACK_NUMBER = 1;
    var AUDIO_TRACK_NUMBER = 2;
    var VIDEO_TRACK_TYPE = 1;
    var AUDIO_TRACK_TYPE = 2;
    var MAX_CHUNK_LENGTH_MS = __pow(2, 15);
    var CODEC_PRIVATE_MAX_SIZE = __pow(2, 12);
    var APP_NAME = "https://github.com/Vanilagy/webm-muxer";
    var SEGMENT_SIZE_BYTES = 6;
    var CLUSTER_SIZE_BYTES = 5;
    var FIRST_TIMESTAMP_BEHAVIORS = ["strict", "offset", "permissive"];
    var _target, _options, _segment, _segmentInfo, _seekHead, _tracksElement, _segmentDuration, _colourElement, _videoCodecPrivate, _audioCodecPrivate, _cues, _currentCluster, _currentClusterTimestamp, _duration, _videoChunkQueue, _audioChunkQueue, _firstVideoTimestamp, _firstAudioTimestamp, _lastVideoTimestamp, _lastAudioTimestamp, _colorSpace, _finalized, _validateOptions, validateOptions_fn, _createFileHeader, createFileHeader_fn, _writeEBMLHeader, writeEBMLHeader_fn, _createSeekHead, createSeekHead_fn, _createSegmentInfo, createSegmentInfo_fn, _createTracks, createTracks_fn, _createSegment, createSegment_fn, _createCues, createCues_fn, _maybeFlushStreamingTarget, maybeFlushStreamingTarget_fn, _segmentDataOffset, segmentDataOffset_get, _writeVideoDecoderConfig, writeVideoDecoderConfig_fn, _fixVP9ColorSpace, fixVP9ColorSpace_fn, _createInternalChunk, createInternalChunk_fn, _validateTimestamp, validateTimestamp_fn, _writeSimpleBlock, writeSimpleBlock_fn, _writeCodecPrivate, writeCodecPrivate_fn, _createNewCluster, createNewCluster_fn, _finalizeCurrentCluster, finalizeCurrentCluster_fn, _ensureNotFinalized, ensureNotFinalized_fn;
    var WebMMuxer = class {
        constructor(options) {
            __privateAdd(this, _validateOptions);
            __privateAdd(this, _createFileHeader);
            __privateAdd(this, _writeEBMLHeader);
            __privateAdd(this, _createSeekHead);
            __privateAdd(this, _createSegmentInfo);
            __privateAdd(this, _createTracks);
            __privateAdd(this, _createSegment);
            __privateAdd(this, _createCues);
            __privateAdd(this, _maybeFlushStreamingTarget);
            __privateAdd(this, _segmentDataOffset);
            __privateAdd(this, _writeVideoDecoderConfig);
            __privateAdd(this, _fixVP9ColorSpace);
            __privateAdd(this, _createInternalChunk);
            __privateAdd(this, _validateTimestamp);
            __privateAdd(this, _writeSimpleBlock);
            __privateAdd(this, _writeCodecPrivate);
            __privateAdd(this, _createNewCluster);
            __privateAdd(this, _finalizeCurrentCluster);
            __privateAdd(this, _ensureNotFinalized);
            __privateAdd(this, _target, void 0);
            __privateAdd(this, _options, void 0);
            __privateAdd(this, _segment, void 0);
            __privateAdd(this, _segmentInfo, void 0);
            __privateAdd(this, _seekHead, void 0);
            __privateAdd(this, _tracksElement, void 0);
            __privateAdd(this, _segmentDuration, void 0);
            __privateAdd(this, _colourElement, void 0);
            __privateAdd(this, _videoCodecPrivate, void 0);
            __privateAdd(this, _audioCodecPrivate, void 0);
            __privateAdd(this, _cues, void 0);
            __privateAdd(this, _currentCluster, void 0);
            __privateAdd(this, _currentClusterTimestamp, void 0);
            __privateAdd(this, _duration, 0);
            __privateAdd(this, _videoChunkQueue, []);
            __privateAdd(this, _audioChunkQueue, []);
            __privateAdd(this, _firstVideoTimestamp, void 0);
            __privateAdd(this, _firstAudioTimestamp, void 0);
            __privateAdd(this, _lastVideoTimestamp, -1);
            __privateAdd(this, _lastAudioTimestamp, -1);
            __privateAdd(this, _colorSpace, void 0);
            __privateAdd(this, _finalized, false);
            __privateMethod(this, _validateOptions, validateOptions_fn).call(this, options);
            __privateSet(this, _options, __spreadValues({
                type: "webm",
                firstTimestampBehavior: "strict"
            }, options));
            if (options.target === "buffer") {
                __privateSet(this, _target, new ArrayBufferWriteTarget());
            } else if (options.target instanceof FileSystemWritableFileStream) {
                __privateSet(this, _target, new FileSystemWritableFileStreamWriteTarget(options.target));
            } else if (typeof options.target === "function") {
                __privateSet(this, _target, new StreamingWriteTarget(options.target));
            } else {
                throw new Error(`Invalid target: ${options.target}`);
            }
            __privateMethod(this, _createFileHeader, createFileHeader_fn).call(this);
        }
        addVideoChunk(chunk, meta, timestamp) {
            let data = new Uint8Array(chunk.byteLength);
            chunk.copyTo(data);
            this.addVideoChunkRaw(data, chunk.type, timestamp != null ? timestamp : chunk.timestamp, meta);
        }
        addVideoChunkRaw(data, type, timestamp, meta) {
            __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
            if (!__privateGet(this, _options).video)
                throw new Error("No video track declared.");
            if (__privateGet(this, _firstVideoTimestamp) === void 0)
                __privateSet(this, _firstVideoTimestamp, timestamp);
            if (meta)
                __privateMethod(this, _writeVideoDecoderConfig, writeVideoDecoderConfig_fn).call(this, meta);
            let internalChunk = __privateMethod(this, _createInternalChunk, createInternalChunk_fn).call(this, data, type, timestamp, VIDEO_TRACK_NUMBER);
            if (__privateGet(this, _options).video.codec === "V_VP9")
                __privateMethod(this, _fixVP9ColorSpace, fixVP9ColorSpace_fn).call(this, internalChunk);
            __privateSet(this, _lastVideoTimestamp, internalChunk.timestamp);
            while (__privateGet(this, _audioChunkQueue).length > 0 && __privateGet(this, _audioChunkQueue)[0].timestamp <= internalChunk.timestamp) {
                let audioChunk = __privateGet(this, _audioChunkQueue).shift();
                __privateMethod(this, _writeSimpleBlock, writeSimpleBlock_fn).call(this, audioChunk);
            }
            if (!__privateGet(this, _options).audio || internalChunk.timestamp <= __privateGet(this, _lastAudioTimestamp)) {
                __privateMethod(this, _writeSimpleBlock, writeSimpleBlock_fn).call(this, internalChunk);
            } else {
                __privateGet(this, _videoChunkQueue).push(internalChunk);
            }
            __privateMethod(this, _maybeFlushStreamingTarget, maybeFlushStreamingTarget_fn).call(this);
        }
        addAudioChunk(chunk, meta, timestamp) {
            let data = new Uint8Array(chunk.byteLength);
            chunk.copyTo(data);
            this.addAudioChunkRaw(data, chunk.type, timestamp != null ? timestamp : chunk.timestamp, meta);
        }
        addAudioChunkRaw(data, type, timestamp, meta) {
            __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
            if (!__privateGet(this, _options).audio)
                throw new Error("No audio track declared.");
            if (__privateGet(this, _firstAudioTimestamp) === void 0)
                __privateSet(this, _firstAudioTimestamp, timestamp);
            let internalChunk = __privateMethod(this, _createInternalChunk, createInternalChunk_fn).call(this, data, type, timestamp, AUDIO_TRACK_NUMBER);
            __privateSet(this, _lastAudioTimestamp, internalChunk.timestamp);
            while (__privateGet(this, _videoChunkQueue).length > 0 && __privateGet(this, _videoChunkQueue)[0].timestamp <= internalChunk.timestamp) {
                let videoChunk = __privateGet(this, _videoChunkQueue).shift();
                __privateMethod(this, _writeSimpleBlock, writeSimpleBlock_fn).call(this, videoChunk);
            }
            if (!__privateGet(this, _options).video || internalChunk.timestamp <= __privateGet(this, _lastVideoTimestamp)) {
                __privateMethod(this, _writeSimpleBlock, writeSimpleBlock_fn).call(this, internalChunk);
            } else {
                __privateGet(this, _audioChunkQueue).push(internalChunk);
            }
            if (meta == null ? void 0 : meta.decoderConfig) {
                __privateMethod(this, _writeCodecPrivate, writeCodecPrivate_fn).call(this, __privateGet(this, _audioCodecPrivate), meta.decoderConfig.description);
            }
            __privateMethod(this, _maybeFlushStreamingTarget, maybeFlushStreamingTarget_fn).call(this);
        }
        finalize() {
            while (__privateGet(this, _videoChunkQueue).length > 0)
                __privateMethod(this, _writeSimpleBlock, writeSimpleBlock_fn).call(this, __privateGet(this, _videoChunkQueue).shift());
            while (__privateGet(this, _audioChunkQueue).length > 0)
                __privateMethod(this, _writeSimpleBlock, writeSimpleBlock_fn).call(this, __privateGet(this, _audioChunkQueue).shift());
            __privateMethod(this, _finalizeCurrentCluster, finalizeCurrentCluster_fn).call(this);
            __privateGet(this, _target).writeEBML(__privateGet(this, _cues));
            let endPos = __privateGet(this, _target).pos;
            let segmentSize = __privateGet(this, _target).pos - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _target).seek(__privateGet(this, _target).offsets.get(__privateGet(this, _segment)) + 4);
            __privateGet(this, _target).writeEBMLVarInt(segmentSize, SEGMENT_SIZE_BYTES);
            __privateGet(this, _segmentDuration).data = new EBMLFloat64(__privateGet(this, _duration));
            __privateGet(this, _target).seek(__privateGet(this, _target).offsets.get(__privateGet(this, _segmentDuration)));
            __privateGet(this, _target).writeEBML(__privateGet(this, _segmentDuration));
            __privateGet(this, _seekHead).data[0].data[1].data = __privateGet(this, _target).offsets.get(__privateGet(this, _cues)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _seekHead).data[1].data[1].data = __privateGet(this, _target).offsets.get(__privateGet(this, _segmentInfo)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _seekHead).data[2].data[1].data = __privateGet(this, _target).offsets.get(__privateGet(this, _tracksElement)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _target).seek(__privateGet(this, _target).offsets.get(__privateGet(this, _seekHead)));
            __privateGet(this, _target).writeEBML(__privateGet(this, _seekHead));
            __privateGet(this, _target).seek(endPos);
            __privateSet(this, _finalized, true);
            if (__privateGet(this, _target) instanceof ArrayBufferWriteTarget) {
                return __privateGet(this, _target).finalize();
            } else if (__privateGet(this, _target) instanceof FileSystemWritableFileStreamWriteTarget) {
                __privateGet(this, _target).finalize();
            } else if (__privateGet(this, _target) instanceof StreamingWriteTarget) {
                __privateGet(this, _target).flush(true);
            }
            return null;
        }
    };
    _target = new WeakMap();
    _options = new WeakMap();
    _segment = new WeakMap();
    _segmentInfo = new WeakMap();
    _seekHead = new WeakMap();
    _tracksElement = new WeakMap();
    _segmentDuration = new WeakMap();
    _colourElement = new WeakMap();
    _videoCodecPrivate = new WeakMap();
    _audioCodecPrivate = new WeakMap();
    _cues = new WeakMap();
    _currentCluster = new WeakMap();
    _currentClusterTimestamp = new WeakMap();
    _duration = new WeakMap();
    _videoChunkQueue = new WeakMap();
    _audioChunkQueue = new WeakMap();
    _firstVideoTimestamp = new WeakMap();
    _firstAudioTimestamp = new WeakMap();
    _lastVideoTimestamp = new WeakMap();
    _lastAudioTimestamp = new WeakMap();
    _colorSpace = new WeakMap();
    _finalized = new WeakMap();
    _validateOptions = new WeakSet();
    validateOptions_fn = function(options) {
        if (options.type && options.type !== "webm" && options.type !== "matroska") {
            throw new Error(`Invalid type: ${options.type}`);
        }
        if (options.firstTimestampBehavior && !FIRST_TIMESTAMP_BEHAVIORS.includes(options.firstTimestampBehavior)) {
            throw new Error(`Invalid first timestamp behavior: ${options.firstTimestampBehavior}`);
        }
    };
    _createFileHeader = new WeakSet();
    createFileHeader_fn = function() {
        __privateMethod(this, _writeEBMLHeader, writeEBMLHeader_fn).call(this);
        __privateMethod(this, _createSeekHead, createSeekHead_fn).call(this);
        __privateMethod(this, _createSegmentInfo, createSegmentInfo_fn).call(this);
        __privateMethod(this, _createTracks, createTracks_fn).call(this);
        __privateMethod(this, _createSegment, createSegment_fn).call(this);
        __privateMethod(this, _createCues, createCues_fn).call(this);
        __privateMethod(this, _maybeFlushStreamingTarget, maybeFlushStreamingTarget_fn).call(this);
    };
    _writeEBMLHeader = new WeakSet();
    writeEBMLHeader_fn = function() {
        var _a;
        let ebmlHeader = { id: 440786851 /* EBML */, data: [
                { id: 17030 /* EBMLVersion */, data: 1 },
                { id: 17143 /* EBMLReadVersion */, data: 1 },
                { id: 17138 /* EBMLMaxIDLength */, data: 4 },
                { id: 17139 /* EBMLMaxSizeLength */, data: 8 },
                { id: 17026 /* DocType */, data: (_a = __privateGet(this, _options).type) != null ? _a : "webm" },
                { id: 17031 /* DocTypeVersion */, data: 2 },
                { id: 17029 /* DocTypeReadVersion */, data: 2 }
            ] };
        __privateGet(this, _target).writeEBML(ebmlHeader);
    };
    _createSeekHead = new WeakSet();
    createSeekHead_fn = function() {
        const kaxCues = new Uint8Array([28, 83, 187, 107]);
        const kaxInfo = new Uint8Array([21, 73, 169, 102]);
        const kaxTracks = new Uint8Array([22, 84, 174, 107]);
        let seekHead = { id: 290298740 /* SeekHead */, data: [
                { id: 19899 /* Seek */, data: [
                        { id: 21419 /* SeekID */, data: kaxCues },
                        { id: 21420 /* SeekPosition */, size: 5, data: 0 }
                    ] },
                { id: 19899 /* Seek */, data: [
                        { id: 21419 /* SeekID */, data: kaxInfo },
                        { id: 21420 /* SeekPosition */, size: 5, data: 0 }
                    ] },
                { id: 19899 /* Seek */, data: [
                        { id: 21419 /* SeekID */, data: kaxTracks },
                        { id: 21420 /* SeekPosition */, size: 5, data: 0 }
                    ] }
            ] };
        __privateSet(this, _seekHead, seekHead);
    };
    _createSegmentInfo = new WeakSet();
    createSegmentInfo_fn = function() {
        let segmentDuration = { id: 17545 /* Duration */, data: new EBMLFloat64(0) };
        __privateSet(this, _segmentDuration, segmentDuration);
        let segmentInfo = { id: 357149030 /* Info */, data: [
                { id: 2807729 /* TimestampScale */, data: 1e6 },
                { id: 19840 /* MuxingApp */, data: APP_NAME },
                { id: 22337 /* WritingApp */, data: APP_NAME },
                segmentDuration
            ] };
        __privateSet(this, _segmentInfo, segmentInfo);
    };
    _createTracks = new WeakSet();
    createTracks_fn = function() {
        let tracksElement = { id: 374648427 /* Tracks */, data: [] };
        __privateSet(this, _tracksElement, tracksElement);
        if (__privateGet(this, _options).video) {
            __privateSet(this, _videoCodecPrivate, { id: 236 /* Void */, size: 4, data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE) });
            let colourElement = { id: 21936 /* Colour */, data: [
                    { id: 21937 /* MatrixCoefficients */, data: 2 },
                    { id: 21946 /* TransferCharacteristics */, data: 2 },
                    { id: 21947 /* Primaries */, data: 2 },
                    { id: 21945 /* Range */, data: 0 }
                ] };
            __privateSet(this, _colourElement, colourElement);
            tracksElement.data.push({ id: 174 /* TrackEntry */, data: [
                    { id: 215 /* TrackNumber */, data: VIDEO_TRACK_NUMBER },
                    { id: 29637 /* TrackUID */, data: VIDEO_TRACK_NUMBER },
                    { id: 131 /* TrackType */, data: VIDEO_TRACK_TYPE },
                    { id: 134 /* CodecID */, data: __privateGet(this, _options).video.codec },
                    __privateGet(this, _videoCodecPrivate),
                    __privateGet(this, _options).video.frameRate ? { id: 2352003 /* DefaultDuration */, data: 1e9 / __privateGet(this, _options).video.frameRate } : null,
                    { id: 224 /* Video */, data: [
                            { id: 176 /* PixelWidth */, data: __privateGet(this, _options).video.width },
                            { id: 186 /* PixelHeight */, data: __privateGet(this, _options).video.height },
                            __privateGet(this, _options).video.alpha ? { id: 21440 /* AlphaMode */, data: 1 } : null,
                            colourElement
                        ] }
                ] });
        }
        if (__privateGet(this, _options).audio) {
            __privateSet(this, _audioCodecPrivate, { id: 236 /* Void */, size: 4, data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE) });
            tracksElement.data.push({ id: 174 /* TrackEntry */, data: [
                    { id: 215 /* TrackNumber */, data: AUDIO_TRACK_NUMBER },
                    { id: 29637 /* TrackUID */, data: AUDIO_TRACK_NUMBER },
                    { id: 131 /* TrackType */, data: AUDIO_TRACK_TYPE },
                    { id: 134 /* CodecID */, data: __privateGet(this, _options).audio.codec },
                    __privateGet(this, _audioCodecPrivate),
                    { id: 225 /* Audio */, data: [
                            { id: 181 /* SamplingFrequency */, data: new EBMLFloat32(__privateGet(this, _options).audio.sampleRate) },
                            { id: 159 /* Channels */, data: __privateGet(this, _options).audio.numberOfChannels },
                            __privateGet(this, _options).audio.bitDepth ? { id: 25188 /* BitDepth */, data: __privateGet(this, _options).audio.bitDepth } : null
                        ] }
                ] });
        }
    };
    _createSegment = new WeakSet();
    createSegment_fn = function() {
        let segment = { id: 408125543 /* Segment */, size: SEGMENT_SIZE_BYTES, data: [
                __privateGet(this, _seekHead),
                __privateGet(this, _segmentInfo),
                __privateGet(this, _tracksElement)
            ] };
        __privateSet(this, _segment, segment);
        __privateGet(this, _target).writeEBML(segment);
    };
    _createCues = new WeakSet();
    createCues_fn = function() {
        __privateSet(this, _cues, { id: 475249515 /* Cues */, data: [] });
    };
    _maybeFlushStreamingTarget = new WeakSet();
    maybeFlushStreamingTarget_fn = function() {
        if (__privateGet(this, _target) instanceof StreamingWriteTarget) {
            __privateGet(this, _target).flush(false);
        }
    };
    _segmentDataOffset = new WeakSet();
    segmentDataOffset_get = function() {
        return __privateGet(this, _target).dataOffsets.get(__privateGet(this, _segment));
    };
    _writeVideoDecoderConfig = new WeakSet();
    writeVideoDecoderConfig_fn = function(meta) {
        if (meta.decoderConfig) {
            if (meta.decoderConfig.colorSpace) {
                let colorSpace = meta.decoderConfig.colorSpace;
                __privateSet(this, _colorSpace, colorSpace);
                __privateGet(this, _colourElement).data = [
                    { id: 21937 /* MatrixCoefficients */, data: {
                            "rgb": 1,
                            "bt709": 1,
                            "bt470bg": 5,
                            "smpte170m": 6
                        }[colorSpace.matrix] },
                    { id: 21946 /* TransferCharacteristics */, data: {
                            "bt709": 1,
                            "smpte170m": 6,
                            "iec61966-2-1": 13
                        }[colorSpace.transfer] },
                    { id: 21947 /* Primaries */, data: {
                            "bt709": 1,
                            "bt470bg": 5,
                            "smpte170m": 6
                        }[colorSpace.primaries] },
                    { id: 21945 /* Range */, data: [1, 2][Number(colorSpace.fullRange)] }
                ];
                let endPos = __privateGet(this, _target).pos;
                __privateGet(this, _target).seek(__privateGet(this, _target).offsets.get(__privateGet(this, _colourElement)));
                __privateGet(this, _target).writeEBML(__privateGet(this, _colourElement));
                __privateGet(this, _target).seek(endPos);
            }
            if (meta.decoderConfig.description) {
                __privateMethod(this, _writeCodecPrivate, writeCodecPrivate_fn).call(this, __privateGet(this, _videoCodecPrivate), meta.decoderConfig.description);
            }
        }
    };
    _fixVP9ColorSpace = new WeakSet();
    fixVP9ColorSpace_fn = function(chunk) {
        if (chunk.type !== "key")
            return;
        if (!__privateGet(this, _colorSpace))
            return;
        let i = 0;
        if (readBits(chunk.data, 0, 2) !== 2)
            return;
        i += 2;
        let profile = (readBits(chunk.data, i + 1, i + 2) << 1) + readBits(chunk.data, i + 0, i + 1);
        i += 2;
        if (profile === 3)
            i++;
        let showExistingFrame = readBits(chunk.data, i + 0, i + 1);
        i++;
        if (showExistingFrame)
            return;
        let frameType = readBits(chunk.data, i + 0, i + 1);
        i++;
        if (frameType !== 0)
            return;
        i += 2;
        let syncCode = readBits(chunk.data, i + 0, i + 24);
        i += 24;
        if (syncCode !== 4817730)
            return;
        if (profile >= 2)
            i++;
        let colorSpaceID = {
            "rgb": 7,
            "bt709": 2,
            "bt470bg": 1,
            "smpte170m": 3
        }[__privateGet(this, _colorSpace).matrix];
        writeBits(chunk.data, i + 0, i + 3, colorSpaceID);
    };
    _createInternalChunk = new WeakSet();
    createInternalChunk_fn = function(data, type, timestamp, trackNumber) {
        let adjustedTimestamp = __privateMethod(this, _validateTimestamp, validateTimestamp_fn).call(this, timestamp, trackNumber);
        let internalChunk = {
            data,
            type,
            timestamp: adjustedTimestamp,
            trackNumber
        };
        return internalChunk;
    };
    _validateTimestamp = new WeakSet();
    validateTimestamp_fn = function(timestamp, trackNumber) {
        let firstTimestamp = trackNumber === VIDEO_TRACK_NUMBER ? __privateGet(this, _firstVideoTimestamp) : __privateGet(this, _firstAudioTimestamp);
        let lastTimestamp = trackNumber === VIDEO_TRACK_NUMBER ? __privateGet(this, _lastVideoTimestamp) : __privateGet(this, _lastAudioTimestamp);
        if (__privateGet(this, _options).firstTimestampBehavior === "strict" && lastTimestamp === -1 && timestamp !== 0) {
            throw new Error(
                `The first chunk for your media track must have a timestamp of 0 (received ${timestamp}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
If you want to allow non-zero first timestamps, set firstTimestampBehavior: 'permissive'.
`
            );
        } else if (__privateGet(this, _options).firstTimestampBehavior === "offset") {
            timestamp -= firstTimestamp;
        }
        if (timestamp < lastTimestamp) {
            throw new Error(
                `Timestamps must be monotonically increasing (went from ${lastTimestamp} to ${timestamp}).`
            );
        }
        return timestamp;
    };
    _writeSimpleBlock = new WeakSet();
    writeSimpleBlock_fn = function(chunk) {
        let msTime = Math.floor(chunk.timestamp / 1e3);
        let clusterIsTooLong = chunk.type !== "key" && msTime - __privateGet(this, _currentClusterTimestamp) >= MAX_CHUNK_LENGTH_MS;
        if (clusterIsTooLong) {
            throw new Error(
                `Current Matroska cluster exceeded its maximum allowed length of ${MAX_CHUNK_LENGTH_MS} milliseconds. In order to produce a correct WebM file, you must pass in a video key frame at least every ${MAX_CHUNK_LENGTH_MS} milliseconds.`
            );
        }
        let shouldCreateNewClusterFromKeyFrame = (chunk.trackNumber === VIDEO_TRACK_NUMBER || !__privateGet(this, _options).video) && chunk.type === "key" && msTime - __privateGet(this, _currentClusterTimestamp) >= 1e3;
        if (!__privateGet(this, _currentCluster) || shouldCreateNewClusterFromKeyFrame) {
            __privateMethod(this, _createNewCluster, createNewCluster_fn).call(this, msTime);
        }
        let prelude = new Uint8Array(4);
        let view = new DataView(prelude.buffer);
        view.setUint8(0, 128 | chunk.trackNumber);
        view.setUint16(1, msTime - __privateGet(this, _currentClusterTimestamp), false);
        view.setUint8(3, Number(chunk.type === "key") << 7);
        let simpleBlock = { id: 163 /* SimpleBlock */, data: [
                prelude,
                chunk.data
            ] };
        __privateGet(this, _target).writeEBML(simpleBlock);
        __privateSet(this, _duration, Math.max(__privateGet(this, _duration), msTime));
    };
    _writeCodecPrivate = new WeakSet();
    writeCodecPrivate_fn = function(element, data) {
        let endPos = __privateGet(this, _target).pos;
        __privateGet(this, _target).seek(__privateGet(this, _target).offsets.get(element));
        element = [
            { id: 25506 /* CodecPrivate */, size: 4, data: new Uint8Array(data) },
            { id: 236 /* Void */, size: 4, data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE - 2 - 4 - data.byteLength) }
        ];
        __privateGet(this, _target).writeEBML(element);
        __privateGet(this, _target).seek(endPos);
    };
    _createNewCluster = new WeakSet();
    createNewCluster_fn = function(timestamp) {
        if (__privateGet(this, _currentCluster)) {
            __privateMethod(this, _finalizeCurrentCluster, finalizeCurrentCluster_fn).call(this);
        }
        __privateSet(this, _currentCluster, { id: 524531317 /* Cluster */, size: CLUSTER_SIZE_BYTES, data: [
                { id: 231 /* Timestamp */, data: timestamp }
            ] });
        __privateGet(this, _target).writeEBML(__privateGet(this, _currentCluster));
        __privateSet(this, _currentClusterTimestamp, timestamp);
        let clusterOffsetFromSegment = __privateGet(this, _target).offsets.get(__privateGet(this, _currentCluster)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
        __privateGet(this, _cues).data.push({ id: 187 /* CuePoint */, data: [
                { id: 179 /* CueTime */, data: timestamp },
                __privateGet(this, _options).video ? { id: 183 /* CueTrackPositions */, data: [
                        { id: 247 /* CueTrack */, data: VIDEO_TRACK_NUMBER },
                        { id: 241 /* CueClusterPosition */, data: clusterOffsetFromSegment }
                    ] } : null,
                __privateGet(this, _options).audio ? { id: 183 /* CueTrackPositions */, data: [
                        { id: 247 /* CueTrack */, data: AUDIO_TRACK_NUMBER },
                        { id: 241 /* CueClusterPosition */, data: clusterOffsetFromSegment }
                    ] } : null
            ] });
    };
    _finalizeCurrentCluster = new WeakSet();
    finalizeCurrentCluster_fn = function() {
        let clusterSize = __privateGet(this, _target).pos - __privateGet(this, _target).dataOffsets.get(__privateGet(this, _currentCluster));
        let endPos = __privateGet(this, _target).pos;
        __privateGet(this, _target).seek(__privateGet(this, _target).offsets.get(__privateGet(this, _currentCluster)) + 4);
        __privateGet(this, _target).writeEBMLVarInt(clusterSize, CLUSTER_SIZE_BYTES);
        __privateGet(this, _target).seek(endPos);
    };
    _ensureNotFinalized = new WeakSet();
    ensureNotFinalized_fn = function() {
        if (__privateGet(this, _finalized)) {
            throw new Error("Cannot add new video or audio chunks after the file has been finalized.");
        }
    };
    var main_default = WebMMuxer;
    var readBits = (bytes, start, end) => {
        let result = 0;
        for (let i = start; i < end; i++) {
            let byteIndex = Math.floor(i / 8);
            let byte = bytes[byteIndex];
            let bitIndex = 7 - (i & 7);
            let bit = (byte & 1 << bitIndex) >> bitIndex;
            result <<= 1;
            result |= bit;
        }
        return result;
    };
    var writeBits = (bytes, start, end, value) => {
        for (let i = start; i < end; i++) {
            let byteIndex = Math.floor(i / 8);
            let byte = bytes[byteIndex];
            let bitIndex = 7 - (i & 7);
            byte &= ~(1 << bitIndex);
            byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
            bytes[byteIndex] = byte;
        }
    };
    return __toCommonJS(main_exports);
})();
WebMMuxer = WebMMuxer.default;
if (typeof module === "object" && typeof module.exports === "object") module.exports = WebMMuxer;

export default WebMMuxer;